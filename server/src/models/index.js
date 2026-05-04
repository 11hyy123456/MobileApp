const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Note = require('./Note');
const Tag = require('./Tag');
const Review = require('./Review');

User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Note, { foreignKey: 'categoryId', as: 'notes' });
Note.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Note.belongsToMany(Tag, { through: 'NoteTags', as: 'tags', foreignKey: 'noteId' });
Tag.belongsToMany(Note, { through: 'NoteTags', as: 'notes', foreignKey: 'tagId' });

Note.hasMany(Review, { foreignKey: 'noteId', as: 'reviews' });
Review.belongsTo(Note, { foreignKey: 'noteId', as: 'note' });

module.exports = {
  sequelize,
  User,
  Category,
  Note,
  Tag,
  Review
};
