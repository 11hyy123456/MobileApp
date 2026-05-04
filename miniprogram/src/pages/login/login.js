const api = require('../../services/api');
const { showError, showSuccess } = require('../../utils/index');

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  async handleLogin() {
    const { username, password } = this.data;

    if (!username) {
      showError('请输入用户名');
      return;
    }
    if (!password) {
      showError('请输入密码');
      return;
    }

    this.setData({ loading: true });

    try {
      const res = await api.auth.login({ username, password });

      const app = getApp();
      app.setLoginInfo(res.data.token, res.data.user);

      showSuccess('登录成功');

      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (error) {
      showError(error.message || '登录失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  goToRegister() {
    wx.navigateTo({ url: '/pages/register/register' });
  }
});
