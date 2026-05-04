const db = require('../db');

const Note = {
  create(data) {
    if (!data.title) {
      throw new Error('Note title is required');
    }
    return db.Note.create(data);
  },

  findById(id) {
    return db.Note.findById(id);
  },

  findAll(userId) {
    if (userId) {
      return db.Note.findByUserId(userId);
    }
    return db.Note.findAll();
  },

  findByUserId(userId) {
    return db.Note.findByUserId(userId);
  },

  findDeleted(userId) {
    return db.Note.findDeleted();
  },

  update(id, data) {
    return db.Note.update(id, data);
  },

  softDelete(id) {
    return db.Note.softDelete(id);
  },

  recover(id) {
    return db.Note.recover(id);
  },

  permanentDelete(id) {
    return db.Note.permanentDelete(id);
  }
};

module.exports = Note;
