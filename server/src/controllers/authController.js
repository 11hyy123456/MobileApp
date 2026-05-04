const { User } = require('../models');
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

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ code: 409, message: '用户名已存在' });
    }

    const user = await User.create({ username, password, phone });
    const token = generateToken(user);

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: { user, token }
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

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }

    const token = generateToken(user);

    res.json({
      code: 200,
      message: '登录成功',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    res.json({
      code: 200,
      message: '获取成功',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    const { username, avatar, phone } = req.body;
    if (username) user.username = username;
    if (avatar !== undefined) user.avatar = avatar;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({
      code: 200,
      message: '更新成功',
      data: user
    });
  } catch (error) {
    next(error);
  }
};
