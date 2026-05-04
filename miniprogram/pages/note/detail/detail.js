const api = require('../../../services/api');
const { showError, showSuccess, formatDate } = require('../../../utils/index');

Page({
  data: {
    note: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.loadNote(options.id);
    }
  },

  async loadNote(id) {
    this.setData({ loading: true });
    try {
      const res = await api.notes.detail(id);
      const note = res.data;
      note.formattedDate = formatDate(note.createdAt);
      this.setData({ note, loading: false });
    } catch (error) {
      showError('加载笔记失败');
      wx.navigateBack();
    }
  },

  goToEdit() {
    wx.navigateTo({ url: `/pages/note/edit/edit?id=${this.data.note.id}` });
  },

  async deleteNote() {
    const res = await wx.showModal({
      title: '确认删除',
      content: '确定要删除这篇笔记吗？',
      confirmColor: '#ff4d4f'
    });

    if (res.confirm) {
      try {
        await api.notes.delete(this.data.note.id);
        showSuccess('删除成功');
        wx.navigateBack();
      } catch (error) {
        showError('删除失败');
      }
    }
  }
});
