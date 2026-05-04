const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'category_id'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: ''
  },
  coverImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cover_image',
    defaultValue: ''
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_deleted'
  },
  nextReviewAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'next_review_at'
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'review_count'
  }
}, {
  tableName: 'notes'
});

module.exports = Note;
