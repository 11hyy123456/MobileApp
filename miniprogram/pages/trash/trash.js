const api = require('../../services/api');
const { showError, showSuccess, formatDate } = require('../../utils/index');

Page({
  data: { trashNotes: [] },

  onShow() { this.loadTrash(); },

  async loadTrash() {
    try {
      const res = await api.notes.list({ isDeleted: true, page: 1, pageSize: 100 });
      const trashNotes = res.data.list.map(note => ({ ...note, formattedDeleteDate: formatDate(note.updatedAt) }));
      this.setData({ trashNotes });
    } catch (error) { showError('加载回收站失败'); }
  },

  async recoverNote(e) {
    try {
      await api.notes.recover(e.currentTarget.dataset.id);
      showSuccess('恢复成功');
      this.loadTrash();
    } catch (error) { showError('恢复失败'); }
  },

  permanentDelete(e) {
    wx.showModal({
      title: '确认永久删除',
      content: '此操作不可恢复，确定要删除吗？',
      confirmColor: '#ff4d4f',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.notes.permanentDelete(e.currentTarget.dataset.id);
            showSuccess('删除成功');
            this.loadTrash();
          } catch (error) { showError('删除失败'); }
        }
      }
    });
  }
});
