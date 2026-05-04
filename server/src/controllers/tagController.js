const { Tag, Note } = require('../models');

exports.createTag = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    const existingTag = await Tag.findOne({ where: { name } });
    if (existingTag) {
      return res.status(409).json({ code: 409, message: '标签已存在' });
    }

    const tag = await Tag.create({ name, color });

    res.status(201).json({
      code: 201,
      message: '标签创建成功',
      data: tag
    });
  } catch (error) {
    next(error);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      include: [{
        model: Note,
        as: 'notes',
        where: { isDeleted: false },
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });

    const result = tags.map(tag => ({
      ...tag.toJSON(),
      noteCount: tag.notes ? tag.notes.length : 0
    }));

    res.json({
      code: 200,
      message: '获取成功',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ code: 404, message: '标签不存在' });
    }

    await tag.destroy();

    res.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotesByTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { page = 1, pageSize = 10 } = req.query;

    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    const tag = await Tag.findByPk(id, {
      include: [{
        model: Note,
        as: 'notes',
        where: { userId, isDeleted: false },
        required: false
      }]
    });

    if (!tag) {
      return res.status(404).json({ code: 404, message: '标签不存在' });
    }

    const notes = tag.notes.slice(offset, offset + limit);

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        tag,
        notes,
        total: tag.notes.length,
        page: parseInt(page),
        pageSize: limit
      }
    });
  } catch (error) {
    next(error);
  }
};
