const express = require('express');
const { body } = require('express-validator');
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [body('name').notEmpty().withMessage('标签名称不能为空')],
  tagController.createTag
);

router.get('/', tagController.getTags);

router.get('/:id/notes', tagController.getNotesByTag);

router.delete('/:id', tagController.deleteTag);

module.exports = router;
