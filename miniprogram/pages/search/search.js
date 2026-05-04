const api = require('../../services/api');
const { showError, debounce, formatDate } = require('../../utils/index');

Page({
  data: { keyword: '', results: [], total: 0, loading: false },

  onSearchInput(e) {
    const keyword = e.detail.value;
    console.log('Search input:', keyword);
    this.setData({ keyword });
    if (keyword.trim()) { this.doSearch(keyword); }
  },

  doSearch: debounce(function(keyword) {
    console.log('doSearch called with:', keyword);
    this.performSearch(keyword);
  }, 300),

  async performSearch(keyword) {
    console.log('performSearch called with:', keyword);
    this.setData({ loading: true });
    try {
      console.log('Calling API with keyword:', keyword);
      const res = await api.notes.list({ keyword, page: 1, pageSize: 50 });
      console.log('Search results:', res);
      const results = res.data.list.map(note => ({ ...note, formattedDate: formatDate(note.createdAt) }));
      this.setData({ results, total: res.data.total });
    } catch (error) {
      console.error('Search error:', error);
      showError('搜索失败');
    }
    finally { this.setData({ loading: false }); }
  },

  goBack() { wx.navigateBack(); },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/note/detail/detail?id=${id}` });
  }
});
