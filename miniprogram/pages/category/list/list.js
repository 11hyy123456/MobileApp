const api = require('../../../services/api');
const { showError, showSuccess } = require('../../../utils/index');

const COLORS = ['#1989fa', '#07c160', '#ff976a', '#ed6a0c', '#7232dd'];

Page({
  data: {
    categories: []
  },

  onShow() {
    this.loadCategories();
  },

  async loadCategories() {
    try {
      const res = await api.categories.list();
      this.setData({ categories: res.data });
    } catch (error) {
      showError('加载分类失败');
    }
  },

  showAddCategory() {
    wx.showModal({
      title: '新建分类',
      editable: true,
      placeholderText: '输入分类名称',
      success: async (res) => {
        if (res.content && res.confirm) {
          const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          try {
            await api.categories.create({ name: res.content, color: randomColor });
            showSuccess('创建成功');
            this.loadCategories();
          } catch (error) {
            showError(error.message || '创建失败');
          }
        }
      }
    });
  },

  deleteCategory(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后该分类下的笔记将变为未分类状态',
      confirmColor: '#ff4d4f',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.categories.delete(id);
            showSuccess('删除成功');
            this.loadCategories();
          } catch (error) {
            showError(error.message || '删除失败');
          }
        }
      }
    });
  }
});
