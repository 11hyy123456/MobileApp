const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').isLength({ min: 3, max: 20 }).withMessage('用户名长度3-20位'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6位')
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空')
  ],
  authController.login
);

router.get('/profile', authMiddleware, authController.getProfile);

router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
