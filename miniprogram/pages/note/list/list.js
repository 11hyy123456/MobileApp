const api = require('../../../services/api');
const { showError, debounce } = require('../../../utils/index');

Page({
  data: {
    notes: [],
    categories: [],
    total: 0,
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    keyword: '',
    selectedCategoryId: 0,
    showFilter: false
  },

  onShow() {
    this.loadNotes(true);
    this.loadCategories();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadNotes(false);
    }
  },

  async loadCategories() {
    try {
      const res = await api.categories.list();
      this.setData({ categories: res.data });
    } catch (error) {
      console.error('Load categories failed:', error);
    }
  },

  async loadNotes(reset = false) {
    if (this.data.loading) return;

    const page = reset ? 1 : this.data.page;
    if (!reset && !this.data.hasMore) return;

    this.setData({ loading: true });

    try {
      const params = { page, pageSize: this.data.pageSize };
      if (this.data.keyword) params.keyword = this.data.keyword;
      if (this.data.selectedCategoryId) params.categoryId = this.data.selectedCategoryId;

      const res = await api.notes.list(params);

      let notes = res.data.list.map(note => ({
        ...note,
        formattedDate: this.formatDate(note.createdAt)
      }));

      if (reset) {
        this.setData({ notes, total: res.data.total, page: page + 1 });
      } else {
        this.setData({ notes: [...this.data.notes, ...notes], page: page + 1 });
      }

      this.setData({ hasMore: res.data.page < res.data.totalPages });
    } catch (error) {
      showError('加载笔记失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
    this.doSearch();
  },

  doSearch: debounce(() => {
    this.loadNotes(true);
  }, 500),

  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedCategoryId: id, page: 1 });
    this.loadNotes(true);
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/note/detail/detail?id=${id}` });
  },

  goToEdit() {
    wx.navigateTo({ url: '/pages/note/edit/edit' });
  }
});
