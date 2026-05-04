App({
  globalData: {
    apiBaseUrl: 'http://192.168.29.1:3000',
    token: null,
    userInfo: null
  },

  onLaunch() {
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  setLoginInfo(token, userInfo) {
    this.globalData.token = token;
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('token', token);
    wx.setStorageSync('userInfo', userInfo);
  },

  clearLoginInfo() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  },

  isLoggedIn() {
    return !!this.globalData.token;
  }
});
