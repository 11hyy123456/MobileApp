const { Note, Category, Tag, Review, User } = require('../models');
const { Op } = require('sequelize');

const EBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30];

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, categoryId, tagIds, summary, coverImage } = req.body;
    const userId = req.user.id;

    const note = await Note.create({
      userId,
      title,
      content,
      categoryId,
      summary: summary || (content ? content.substring(0, 200) : ''),
      coverImage,
      nextReviewAt: new Date()
    });

    if (tagIds && tagIds.length > 0) {
      await note.setTags(tagIds);
    }

    const fullNote = await Note.findByPk(note.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.status(201).json({
      code: 201,
      message: '笔记创建成功',
      data: fullNote
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 10, categoryId, tagId, keyword, isDeleted } = req.query;

    const where = { userId };
    if (categoryId) where.categoryId = categoryId;
    if (isDeleted !== undefined) where.isDeleted = isDeleted === 'true';
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const { count, rows } = await Note.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        pageSize: limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({
      where: { id, userId },
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' },
        {
          model: Review,
          as: 'reviews',
          order: [['reviewAt', 'DESC']]
        }
      ]
    });

    if (!note) {
      return res.status(404).json({ code: 404, message: '笔记不存在' });
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content, categoryId, tagIds, summary, coverImage } = req.body;

    const note = await Note.findOne({ where: { id, userId } });
    if (!note) {
      return res.status(404).json({ code: 404, message: '笔记不存在' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (categoryId !== undefined) note.categoryId = categoryId;
    if (summary !== undefined) note.summary = summary;
    if (coverImage !== undefined) note.coverImage = coverImage;

    await note.save();

    if (tagIds !== undefined) {
      await note.setTags(tagIds);
    }

    const fullNote = await Note.findByPk(note.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.json({
      code: 200,
      message: '更新成功',
      data: fullNote
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { permanent } = req.query;

    const note = await Note.findOne({ where: { id, userId } });
    if (!note) {
      return res.status(404).json({ code: 404, message: '笔记不存在' });
    }

    if (permanent === 'true') {
      await note.destroy({ force: true });
    } else {
      note.isDeleted = true;
      await note.save();
    }

    res.json({
      code: 200,
      message: permanent === 'true' ? '永久删除成功' : '删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.recoverNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ where: { id, userId, isDeleted: true } });
    if (!note) {
      return res.status(404).json({ code: 404, message: '回收站笔记不存在' });
    }

    note.isDeleted = false;
    await note.save();

    res.json({
      code: 200,
      message: '恢复成功',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

exports.reviewNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { effect, notes } = req.body;

    const note = await Note.findOne({ where: { id, userId } });
    if (!note) {
      return res.status(404).json({ code: 404, message: '笔记不存在' });
    }

    const review = await Review.create({
      noteId: id,
      reviewAt: new Date(),
      effect,
      notes
    });

    note.reviewCount += 1;

    const currentReviewIndex = EBINGHAUS_INTERVALS.indexOf(
      EBINGHAUS_INTERVALS.find(interval => {
        const nextReview = new Date(review.reviewAt);
        nextReview.setDate(nextReview.getDate() + interval);
        return nextReview > new Date();
      }) || EBINGHAUS_INTERVALS[EBINGHAUS_INTERVALS.length - 1]
    );

    const nextInterval = EBINGHAUS_INTERVALS[currentReviewIndex] || EBINGHAUS_INTERVALS[EBINGHAUS_INTERVALS.length - 1];
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);
    note.nextReviewAt = nextReviewDate;

    await note.save();

    res.json({
      code: 200,
      message: '复习记录已保存',
      data: { review, nextReviewAt: note.nextReviewAt }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDueReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notes = await Note.findAll({
      where: {
        userId,
        isDeleted: false,
        nextReviewAt: {
          [Op.lte]: new Date()
        }
      },
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ],
      order: [['nextReviewAt', 'ASC']]
    });

    res.json({
      code: 200,
      message: '获取成功',
      data: notes
    });
  } catch (error) {
    next(error);
  }
};
