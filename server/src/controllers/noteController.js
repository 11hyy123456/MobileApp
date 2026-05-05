const Note = require('../models/Note');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Review = require('../models/Review');
const db = require('../db');

const EBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30];

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, categoryId, tagIds, summary, coverImage } = req.body;
    const userId = req.user.id;

    const note = Note.create({
      userId,
      title,
      content,
      categoryId,
      summary: summary || (content ? content.substring(0, 200) : ''),
      coverImage,
      nextReviewAt: new Date().toISOString(),
      reviewCount: 0
    });

    if (tagIds && tagIds.length > 0) {
      tagIds.forEach(tagId => {
        db.db.noteTags.push({
          noteId: note.id,
          tagId: tagId
        });
      });
      db.saveDB();
    }

    res.status(201).json({
      code: 201,
      message: '笔记创建成功',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 10, categoryId, tagId, keyword, isDeleted } = req.query;

    let notes = Note.findByUserId(userId);

    if (isDeleted === 'true') {
      notes = notes.filter(n => n.isDeleted);
    } else if (isDeleted !== 'true') {
      notes = notes.filter(n => !n.isDeleted);
    }

    if (categoryId) {
      notes = notes.filter(n => n.categoryId == categoryId);
    }

    if (tagId) {
      const noteIds = db.db.noteTags.filter(nt => nt.tagId == tagId).map(nt => nt.noteId);
      notes = notes.filter(n => noteIds.includes(n.id));
    }

    if (keyword) {
      const kw = keyword.toLowerCase();
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(kw) ||
        (n.content && n.content.toLowerCase().includes(kw))
      );
    }

    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = notes.length;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const paginatedNotes = notes.slice(offset, offset + parseInt(pageSize));

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: paginatedNotes,
        total: total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / parseInt(pageSize))
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

    const note = Note.findById(id);
    if (!note || note.userId != userId) {
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

    const note = Note.findById(id);
    if (!note || note.userId != userId) {
      return res.status(404).json({ code: 404, message: '笔记不存在' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (summary !== undefined) updateData.summary = summary;
    if (coverImage !== undefined) updateData.coverImage = coverImage;

    const updatedNote = Note.update(id, updateData);

    if (tagIds !== undefined) {
      db.db.noteTags = db.db.noteTags.filter(nt => nt.noteId != id);
      tagIds.forEach(tagId => {
        db.db.noteTags.push({ noteId: id, tagId: tagId });
      });
      db.saveDB();
    }

    res.json({
      code: 200,
      message: '更新成功',
      data: updatedNote
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = Note.findById(id);
    if (!note || note.userId != userId) {
      return res.status(404).json({ code: 404, message: '笔记不存在' });
    }

    Note.softDelete(id);

    res.json({
      code: 200,
      message: '删除成功',
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

    const note = Note.findById(id);
    if (!note || note.userId != userId || !note.isDeleted) {
      return res.status(404).json({ code: 404, message: '回收站笔记不存在' });
    }

    const recoveredNote = Note.recover(id);

    res.json({
      code: 200,
      message: '恢复成功',
      data: recoveredNote
    });
  } catch (error) {
    next(error);
  }
};

exports.permanentDeleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = Note.findById(id);
    if (!note || note.userId != userId || !note.isDeleted) {
      return res.status(404).json({ code: 404, message: '回收站笔记不存在' });
    }

    Note.permanentDelete(id);
    db.db.noteTags = db.db.noteTags.filter(nt => nt.noteId != id);
    db.saveDB();

    res.json({
      code: 200,
      message: '永久删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.reviewNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { effect, notes: reviewNotes } = req.body;

    const note = Note.findById(id);
    if (!note || note.userId != userId) {
      return res.status(404).json({ code: 404, message: '笔记不存在' });
    }

    const review = Review.create({
      noteId: id,
      userId,
      reviewAt: new Date().toISOString(),
      effect,
      notes: reviewNotes,
      nextReviewAt: null
    });

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

    Note.update(id, {
      nextReviewAt: nextReviewDate.toISOString(),
      reviewCount: (note.reviewCount || 0) + 1
    });

    res.json({
      code: 200,
      message: '复习记录已保存',
      data: { review, nextReviewAt: nextReviewDate.toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDueReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date().toISOString();

    console.log('getDueReviews - userId:', userId, 'now:', now);
    
    const userNotes = Note.findByUserId(userId);
    console.log('getDueReviews - userNotes count:', userNotes.length);
    console.log('getDueReviews - userNotes:', userNotes.map(n => ({ id: n.id, title: n.title, nextReviewAt: n.nextReviewAt, isDeleted: n.isDeleted })));

    const notes = userNotes.filter(n =>
      !n.isDeleted && n.nextReviewAt && n.nextReviewAt <= now
    );
    
    console.log('getDueReviews - due notes count:', notes.length);

    notes.sort((a, b) => new Date(a.nextReviewAt) - new Date(b.nextReviewAt));

    res.json({
      code: 200,
      message: '获取成功',
      data: notes
    });
  } catch (error) {
    next(error);
  }
};
