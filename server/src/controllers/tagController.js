const Tag = require('../models/Tag');
const Note = require('../models/Note');
const db = require('../db');

exports.createTag = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    const userId = req.user.id;

    const existingTag = db.db.tags.find(t => t.name === name && t.userId === userId);
    if (existingTag) {
      return res.status(409).json({ code: 409, message: '标签已存在' });
    }

    const tag = Tag.create({ name, color, userId });

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
    const userId = req.user.id;
    const tags = Tag.findByUserId(userId);

    const result = tags.map(tag => {
      const noteIds = db.db.noteTags.filter(nt => nt.tagId == tag.id).map(nt => nt.noteId);
      const notes = Note.findByUserId(userId).filter(n => noteIds.includes(n.id) && !n.isDeleted);
      return {
        ...tag,
        noteCount: notes.length
      };
    });

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
    const userId = req.user.id;

    const tag = Tag.findById(id);
    if (!tag || tag.userId != userId) {
      return res.status(404).json({ code: 404, message: '标签不存在' });
    }

    db.db.noteTags = db.db.noteTags.filter(nt => nt.tagId != id);
    db.saveDB();
    Tag.delete(id);

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

    const tag = Tag.findById(id);
    if (!tag || tag.userId != userId) {
      return res.status(404).json({ code: 404, message: '标签不存在' });
    }

    const noteIds = db.db.noteTags.filter(nt => nt.tagId == id).map(nt => nt.noteId);
    const notes = Note.findByUserId(userId).filter(n => noteIds.includes(n.id) && !n.isDeleted);

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const paginatedNotes = notes.slice(offset, offset + parseInt(pageSize));

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        tag,
        notes: paginatedNotes,
        total: notes.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};
