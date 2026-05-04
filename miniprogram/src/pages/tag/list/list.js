const api = require('../../../services/api');
const { showError, showSuccess } = require('../../../utils/index');

Page({
  data: {
    tags: []
  },

  onShow() {
    this.loadTags();
  },

  async loadTags() {
    try {
      const res = await api.tags.list();
      this.setData({ tags: res.data });
    } catch (error) {
      showError('加载标签失败');
    }
  },

  showAddTag() {
    wx.showModal({
      title: '新建标签',
      editable: true,
      placeholderText: '输入标签名称',
      success: async (res) => {
        if (res.content && res.confirm) {
          try {
            await api.tags.create({ name: res.content });
            showSuccess('创建成功');
            this.loadTags();
          } catch (error) {
            showError(error.message || '创建失败');
          }
        }
      }
    });
  },

  deleteTag(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个标签吗？',
      confirmColor: '#ff4d4f',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.tags.delete(id);
            showSuccess('删除成功');
            this.loadTags();
          } catch (error) {
            showError(error.message || '删除失败');
          }
        }
      }
    });
  }
});
