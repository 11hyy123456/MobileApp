const api = require('../../services/api');
const { showError, showSuccess } = require('../../utils/index');

Page({
  data: {
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    loading: false
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  async handleRegister() {
    const { username, phone, password, confirmPassword } = this.data;

    if (!username || username.length < 3) {
      showError('用户名至少3位');
      return;
    }
    if (!password || password.length < 6) {
      showError('密码至少6位');
      return;
    }
    if (password !== confirmPassword) {
      showError('两次密码输入不一致');
      return;
    }

    this.setData({ loading: true });

    try {
      const res = await api.auth.register({ username, password, phone });

      const app = getApp();
      app.setLoginInfo(res.data.token, res.data.user);

      showSuccess('注册成功');

      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (error) {
      showError(error.message || '注册失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  goToLogin() {
    wx.navigateBack();
  }
});
