const api = require('../../services/api');
const { showLoading, hideLoading, showError, debounce, formatDate } = require('../../utils/index');

Page({
  data: {
    keyword: '',
    results: [],
    history: [],
    total: 0,
    loading: false
  },

  onLoad() {
    this.loadHistory();
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    if (keyword.trim()) {
      this.search(keyword);
    } else {
      this.setData({ results: [], total: 0 });
    }
  },

  search = debounce((keyword) => {
    this.performSearch(keyword);
  }, 300),

  async performSearch(keyword) {
    this.setData({ loading: true });
    try {
      const res = await api.notes.list({ keyword, page: 1, pageSize: 50 });

      const results = res.data.list.map(note => ({
        ...note,
        formattedDate: formatDate(note.createdAt),
        highlightedContent: this.highlightKeyword(note.content, keyword)
      }));

      this.setData({ results, total: res.data.total });
      this.saveHistory(keyword);
    } catch (error) {
      showError('搜索失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  highlightKeyword(content, keyword) {
    if (!content || !keyword) return content;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return content.replace(regex, '**$1**').substring(0, 200);
  },

  loadHistory() {
    const history = wx.getStorageSync('search_history') || [];
    this.setData({ history });
  },

  saveHistory(keyword) {
    if (!keyword.trim()) return;
    let history = this.data.history;
    history = history.filter(h => h !== keyword);
    history.unshift(keyword);
    history = history.slice(0, 10);
    wx.setStorageSync('search_history', history);
    this.setData({ history });
  },

  clearHistory() {
    wx.removeStorageSync('search_history');
    this.setData({ history: [] });
  },

  useHistory(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.performSearch(keyword);
  },

  clearSearch() {
    this.setData({ keyword: '', results: [], total: 0 });
  },

  goBack() {
    wx.navigateBack();
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/note/detail/detail?id=${id}` });
  }
});
