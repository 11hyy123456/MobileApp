const api = require('../services/api');

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatDateTime = (dateString) => {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

const relativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = date - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '今天';
  if (days === 1) return '明天';
  if (days === -1) return '昨天';
  if (days > 1 && days <= 7) return `${days}天后`;
  if (days < -1 && days >= -7) return `${Math.abs(days)}天前`;
  return formatDate(dateString);
};

const debounce = (fn, delay = 300) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

const throttle = (fn, delay = 300) => {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
};

const showError = (message) => {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
};

const showSuccess = (message) => {
  wx.showToast({
    title: message,
    icon: 'success',
    duration: 1500
  });
};

const showLoading = (title = '加载中...') => {
  wx.showLoading({ title, mask: true });
};

const hideLoading = () => {
  wx.hideLoading();
};

const markdownToWxml = (markdown) => {
  if (!markdown) return '';

  let html = markdown;

  html = html.replace(/^### (.*$)/gim, '<text class="h3">$1</text>');
  html = html.replace(/^## (.*$)/gim, '<text class="h2">$1</text>');
  html = html.replace(/^# (.*$)/gim, '<text class="h1">$1</text>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<text class="bold">$1</text>');
  html = html.replace(/\*(.*?)\*/g, '<text class="italic">$1</text>');
  html = html.replace(/`(.*?)`/g, '<text class="code">$1</text>');

  html = html.replace(/^\- (.*$)/gim, '<text class="list-item">• $1</text>');
  html = html.replace(/^\d+\. (.*$)/gim, '<text class="list-item">$1</text>');

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<text class="link">$1</text>');

  html = html.replace(/\n/g, '\n');

  return html;
};

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  relativeTime,
  debounce,
  throttle,
  showError,
  showSuccess,
  showLoading,
  hideLoading,
  markdownToWxml
};
