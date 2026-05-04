const db = require('../db');

const Review = {
  create(data) {
    if (!data.noteId) {
      throw new Error('Note ID is required');
    }
    return db.Review.create(data);
  },

  findById(id) {
    return db.Review.findById(id);
  },

  findAll() {
    return db.Review.findAll();
  },

  findByNoteId(noteId) {
    return db.Review.findByNoteId(noteId);
  },

  findDueReviews(userId) {
    return db.Review.findDueReviews(userId);
  },

  update(id, data) {
    return db.Review.update(id, data);
  },

  delete(id) {
    return db.Review.delete(id);
  }
};

module.exports = Review;
