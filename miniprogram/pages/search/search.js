const api = require('../../services/api');
const { showError, debounce, formatDate } = require('../../utils/index');

Page({
  data: { keyword: '', results: [], total: 0, loading: false },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    if (keyword.trim()) { this.doSearch(keyword); }
  },

  doSearch: debounce((keyword) => {
    this.performSearch(keyword);
  }, 300),

  async performSearch(keyword) {
    this.setData({ loading: true });
    try {
      const res = await api.notes.list({ keyword, page: 1, pageSize: 50 });
      const results = res.data.list.map(note => ({ ...note, formattedDate: formatDate(note.createdAt) }));
      this.setData({ results, total: res.data.total });
    } catch (error) { showError('搜索失败'); }
    finally { this.setData({ loading: false }); }
  },

  goBack() { wx.navigateBack(); },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/note/detail/detail?id=${id}` });
  }
});
