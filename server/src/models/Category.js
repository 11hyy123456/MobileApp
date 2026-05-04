const db = require('../db');

const Category = {
  create(data) {
    if (!data.name) {
      throw new Error('Category name is required');
    }
    return db.Category.create(data);
  },

  findById(id) {
    return db.Category.findById(id);
  },

  findAll(userId) {
    if (userId) {
      return db.Category.findByUserId(userId);
    }
    return db.Category.findAll();
  },

  findByUserId(userId) {
    return db.Category.findByUserId(userId);
  },

  update(id, data) {
    return db.Category.update(id, data);
  },

  delete(id) {
    return db.Category.delete(id);
  }
};

module.exports = Category;
