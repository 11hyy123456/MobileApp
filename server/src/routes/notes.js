const express = require('express');
const { body } = require('express-validator');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('标题不能为空')
  ],
  noteController.createNote
);

router.get('/', noteController.getNotes);

router.get('/due-reviews', noteController.getDueReviews);

router.get('/:id', noteController.getNote);

router.put('/:id', noteController.updateNote);

router.delete('/:id', noteController.deleteNote);

router.post('/:id/recover', noteController.recoverNote);

router.post('/:id/review', noteController.reviewNote);

module.exports = router;
