const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: '#1989fa'
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'notes'
  }
}, {
  tableName: 'categories'
});

module.exports = Category;
