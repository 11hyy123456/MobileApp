const { Category, Note } = require('../models');
const { Op } = require('sequelize');

exports.createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    const userId = req.user.id;

    const category = await Category.create({ userId, name, color, icon });

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

    const categories = await Category.findAll({
      where: { userId },
      include: [{
        model: Note,
        as: 'notes',
        where: { isDeleted: false },
        required: false
      }],
      order: [['createdAt', 'ASC']]
    });

    const result = categories.map(cat => ({
      ...cat.toJSON(),
      noteCount: cat.notes ? cat.notes.length : 0
    }));

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

    const category = await Category.findOne({ where: { id, userId } });
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }

    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;
    if (icon !== undefined) category.icon = icon;

    await category.save();

    res.json({
      code: 200,
      message: '更新成功',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const category = await Category.findOne({ where: { id, userId } });
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }

    await Note.update({ categoryId: null }, { where: { categoryId: id } });
    await category.destroy();

    res.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
