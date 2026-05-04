const api = require('../../services/api');
const { showSuccess } = require('../../utils/index');

Page({
  data: {
    userInfo: null,
    stats: { noteCount: 0, categoryCount: 0, reviewCount: 0, streak: 0 }
  },

  onShow() {
    this.loadProfile();
    this.loadStats();
  },

  loadProfile() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    if (userInfo) { this.setData({ userInfo }); }
  },

  async loadStats() {
    try {
      const [notesRes, categoriesRes] = await Promise.all([
        api.notes.list({ page: 1, pageSize: 1 }),
        api.categories.list()
      ]);
      this.setData({
        stats: {
          noteCount: notesRes.data.total,
          categoryCount: categoriesRes.data.length,
          reviewCount: 42,
          streak: 7
        }
      });
    } catch (error) { console.error('Load stats failed:', error); }
  },

  goToTrash() { wx.navigateTo({ url: '/pages/trash/trash' }); },
  goToCategories() { wx.navigateTo({ url: '/pages/category/list/list' }); },
  goToTags() { wx.navigateTo({ url: '/pages/tag/list/list' }); },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.clearLoginInfo();
          wx.redirectTo({ url: '/pages/login/login' });
        }
      }
    });
  }
});
