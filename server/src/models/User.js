const bcrypt = require('bcryptjs');
const db = require('../db');

const User = {
  async create(userData) {
    if (!userData.username || !userData.password) {
      throw new Error('Username and password are required');
    }
    const existingUser = db.User.findByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = db.User.create({
      ...userData,
      password: hashedPassword
    });
    return user;
  },

  async findById(id) {
    return db.User.findById(id);
  },

  async findByUsername(username) {
    return db.User.findByUsername(username);
  },

  async comparePassword(user, candidatePassword) {
    return bcrypt.compare(candidatePassword, user.password);
  },

  toJSON(user) {
    const { password, ...result } = user;
    return result;
  }
};

module.exports = User;
