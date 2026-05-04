const api = require('../../../services/api');
const { showError, showSuccess } = require('../../../utils/index');

Page({
  data: {
    id: null,
    title: '',
    content: '',
    categories: [],
    selectedCategoryId: 0,
    saving: false
  },

  onLoad(options) {
    if (options.id) {
      wx.setNavigationBarTitle({ title: '编辑笔记' });
      this.setData({ id: options.id });
      this.loadNote(options.id);
    } else {
      wx.setNavigationBarTitle({ title: '新建笔记' });
    }
    this.loadCategories();
  },

  async loadNote(id) {
    try {
      const res = await api.notes.detail(id);
      const note = res.data;
      this.setData({
        title: note.title,
        content: note.content,
        selectedCategoryId: note.categoryId || 0
      });
    } catch (error) {
      showError('加载笔记失败');
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

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedCategoryId: id });
  },

  async saveNote() {
    const { title, content } = this.data;

    if (!title.trim()) {
      showError('请输入笔记标题');
      return;
    }

    if (!content.trim()) {
      showError('请输入笔记内容');
      return;
    }

    this.setData({ saving: true });

    try {
      const data = {
        title: title.trim(),
        content: content.trim(),
        categoryId: this.data.selectedCategoryId || null,
        summary: content.substring(0, 200)
      };

      if (this.data.id) {
        await api.notes.update(this.data.id, data);
        showSuccess('更新成功');
      } else {
        await api.notes.create(data);
        showSuccess('创建成功');
      }

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      showError(error.message || '保存失败');
    } finally {
      this.setData({ saving: false });
    }
  }
});
