const api = require('../../services/api');
const { showError, showSuccess } = require('../../utils/index');

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    stats: {
      noteCount: 0,
      dueReviewCount: 0,
      categoryCount: 0,
      reviewStreak: 0
    },
    recentNotes: []
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    if (this.data.isLoggedIn) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    if (this.data.isLoggedIn) {
      this.loadData();
    }
    wx.stopPullDownRefresh();
  },

  checkLogin() {
    const app = getApp();
    const isLoggedIn = app.isLoggedIn();
    const userInfo = app.globalData.userInfo;
    this.setData({ isLoggedIn, userInfo });
  },

  async loadData() {
    try {
      const notesRes = await api.notes.list({ page: 1, pageSize: 5 });
      const categoriesRes = await api.categories.list();

      const recentNotes = notesRes.data.list.map(note => ({
        ...note,
        formattedDate: this.formatDate(note.createdAt)
      }));

      this.setData({
        stats: {
          noteCount: notesRes.data.total,
          dueReviewCount: 0,
          categoryCount: categoriesRes.data.length,
          reviewStreak: 7
        },
        recentNotes
      });
    } catch (error) {
      console.error('Load data failed:', error);
    }
  },

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },

  goToProfile() {
    if (this.data.isLoggedIn) {
      wx.navigateTo({ url: '/pages/profile/profile' });
    } else {
      this.goToLogin();
    }
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  goToNotes() {
    wx.switchTab({ url: '/pages/note/list/list' });
  },

  goToNoteDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/note/detail/detail?id=${id}` });
  },

  goToNewNote() {
    wx.navigateTo({ url: '/pages/note/edit/edit' });
  },

  goToSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  goToReview() {
    wx.switchTab({ url: '/pages/review/list/list' });
  },

  goToCategories() {
    wx.navigateTo({ url: '/pages/category/list/list' });
  }
});
