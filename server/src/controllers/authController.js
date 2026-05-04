const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: '参数错误', errors: errors.array() });
    }

    const { username, password, phone } = req.body;

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ code: 409, message: '用户名已存在' });
    }

    const user = await User.create({ username, password, phone });
    const token = generateToken(user);
    const userData = User.toJSON(user);

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: { user: userData, token }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: '参数错误', errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }

    const isMatch = await User.comparePassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }

    const token = generateToken(user);
    const userData = User.toJSON(user);

    res.json({
      code: 200,
      message: '登录成功',
      data: { user: userData, token }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: User.toJSON(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    const { username, avatar, phone } = req.body;
    const updateData = {};
    if (username) updateData.username = username;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (phone !== undefined) updateData.phone = phone;

    const updatedUser = await User.findById(req.user.id);
    Object.assign(updatedUser, updateData);

    res.json({
      code: 200,
      message: '更新成功',
      data: User.toJSON(updatedUser)
    });
  } catch (error) {
    next(error);
  }
};
