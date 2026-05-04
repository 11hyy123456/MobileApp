const api = require('../../../services/api');
const { showError, formatDate } = require('../../../utils/index');

Page({
  data: {
    dueNotes: [],
    dueCount: 0,
    reviewedToday: 0,
    streak: 7
  },

  onShow() {
    this.loadReviews();
  },

  async loadReviews() {
    try {
      const res = await api.notes.dueReviews();
      const dueNotes = res.data.map(note => ({
        ...note,
        formattedDueDate: formatDate(note.nextReviewAt)
      }));
      this.setData({
        dueNotes,
        dueCount: dueNotes.length
      });
    } catch (error) {
      showError('加载复习数据失败');
    }
  },

  goToNote(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/note/detail/detail?id=${id}` });
  }
});
