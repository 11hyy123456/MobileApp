const db = require('../db');

const Tag = {
  create(data) {
    if (!data.name) {
      throw new Error('Tag name is required');
    }
    return db.Tag.create(data);
  },

  findById(id) {
    return db.Tag.findById(id);
  },

  findAll(userId) {
    if (userId) {
      return db.Tag.findByUserId(userId);
    }
    return db.Tag.findAll();
  },

  findByUserId(userId) {
    return db.Tag.findByUserId(userId);
  },

  findOrCreate(name, userId) {
    return db.Tag.findOrCreate(name, userId);
  },

  update(id, data) {
    return db.Tag.update(id, data);
  },

  delete(id) {
    return db.Tag.delete(id);
  }
};

module.exports = Tag;
