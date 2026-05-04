const api = require('../../services/api');
const { showSuccess, formatDate } = require('../../utils/index');

Page({
  data: {
    userInfo: null,
    stats: {
      noteCount: 0,
      categoryCount: 0,
      reviewCount: 0,
      streak: 0
    }
  },

  onShow() {
    this.loadProfile();
    this.loadStats();
  },

  loadProfile() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo,
        joinDate: formatDate(userInfo.createdAt)
      });
    }
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
    } catch (error) {
      console.error('Load stats failed:', error);
    }
  },

  goToTrash() {
    wx.navigateTo({ url: '/pages/trash/trash' });
  },

  goToCategories() {
    wx.navigateTo({ url: '/pages/category/list/list' });
  },

  goToTags() {
    wx.navigateTo({ url: '/pages/tag/list/list' });
  },

  editProfile() {
    wx.showModal({
      title: '编辑资料',
      editable: true,
      placeholderText: '输入新的用户名',
      content: this.data.userInfo.username,
      success: async (res) => {
        if (res.confirm && res.content) {
          try {
            const result = await api.auth.updateProfile({ username: res.content });
            const app = getApp();
            app.globalData.userInfo = result.data;
            this.setData({ userInfo: result.data });
            showSuccess('更新成功');
          } catch (error) {
            wx.showToast({ title: '更新失败', icon: 'none' });
          }
        }
      }
    });
  },

  showAbout() {
    wx.showModal({
      title: '关于学习笔记',
      content: '版本: 1.0.0\n\n一款帮助你高效学习和复习的小程序，基于艾宾浩斯遗忘曲线设计。',
      showCancel: false
    });
  },

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
