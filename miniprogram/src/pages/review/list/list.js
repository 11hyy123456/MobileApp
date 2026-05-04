const api = require('../../../services/api');
const { showLoading, hideLoading, showError, formatDate, relativeTime } = require('../../../utils/index');

Page({
  data: {
    dueNotes: [],
    upcomingNotes: [],
    dueCount: 0,
    reviewedToday: 0,
    streak: 7
  },

  onShow() {
    this.loadReviews();
  },

  onPullDownRefresh() {
    this.loadReviews();
  },

  async loadReviews() {
    try {
      const res = await api.notes.dueReviews();
      const dueNotes = res.data.map(note => ({
        ...note,
        formattedDueDate: formatDate(note.nextReviewAt),
        relativeDueDate: relativeTime(note.nextReviewAt)
      }));

      const upcomingNotes = dueNotes.filter(n => {
        const dueDate = new Date(n.nextReviewAt);
        const now = new Date();
        const diff = dueDate - now;
        return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
      });

      this.setData({
        dueNotes,
        upcomingNotes: upcomingNotes.slice(0, 5),
        dueCount: dueNotes.length
      });
    } catch (error) {
      showError('加载复习数据失败');
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  goToReview(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/note/detail/detail?id=${id}` });
  }
});
