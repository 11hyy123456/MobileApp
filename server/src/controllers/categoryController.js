const Category = require('../models/Category');
const Note = require('../models/Note');

exports.createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    const userId = req.user.id;

    const category = Category.create({ userId, name, color, icon });

    res.status(201).json({
      code: 201,
      message: '分类创建成功',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categories = Category.findByUserId(userId);

    const result = categories.map(cat => {
      const notes = Note.findByUserId(userId).filter(n => n.categoryId == cat.id && !n.isDeleted);
      return {
        ...cat,
        noteCount: notes.length
      };
    });

    res.json({
      code: 200,
      message: '获取成功',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, color, icon } = req.body;

    const category = Category.findById(id);
    if (!category || category.userId != userId) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;

    const updatedCategory = Category.update(id, updateData);

    res.json({
      code: 200,
      message: '更新成功',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const category = Category.findById(id);
    if (!category || category.userId != userId) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }

    const notes = Note.findByUserId(userId).filter(n => n.categoryId == id);
    notes.forEach(note => {
      Note.update(note.id, { categoryId: null });
    });

    Category.delete(id);

    res.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
