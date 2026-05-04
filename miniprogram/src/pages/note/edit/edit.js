const api = require('../../../services/api');
const { showLoading, hideLoading, showError, showSuccess } = require('../../../utils/index');

Page({
  data: {
    id: null,
    title: '',
    content: '',
    htmlContent: '',
    mode: 'edit',
    categories: [],
    allTags: [],
    selectedCategoryId: 0,
    selectedTagIds: [],
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
    this.loadTags();
  },

  onUnload() {
    if (this.data.title || this.data.content) {
      this.saveDraft();
    }
  },

  async loadNote(id) {
    try {
      const res = await api.notes.detail(id);
      const note = res.data;

      this.setData({
        title: note.title,
        content: note.content,
        htmlContent: this.parseMarkdown(note.content),
        selectedCategoryId: note.categoryId || 0,
        selectedTagIds: note.tags ? note.tags.map(t => t.id) : []
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

  async loadTags() {
    try {
      const res = await api.tags.list();
      this.setData({ allTags: res.data });
    } catch (error) {
      console.error('Load tags failed:', error);
    }
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    const content = e.detail.value;
    this.setData({
      content,
      htmlContent: this.parseMarkdown(content)
    });
  },

  onContentBlur() {
    this.saveDraft();
  },

  parseMarkdown(content) {
    if (!content) return '';

    let html = content
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br/>');

    return html;
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ mode });
  },

  insertMarkdown(e) {
    const type = e.currentTarget.dataset.type;
    let insertion = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        insertion = '**粗体文字**';
        cursorOffset = 2;
        break;
      case 'italic':
        insertion = '*斜体文字*';
        cursorOffset = 1;
        break;
      case 'code':
        insertion = '`代码`';
        cursorOffset = 1;
        break;
      case 'list':
        insertion = '\n- 列表项';
        cursorOffset = 3;
        break;
    }

    const content = this.data.content + insertion;
    this.setData({
      content,
      htmlContent: this.parseMarkdown(content)
    });
  },

  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedCategoryId: id });
  },

  toggleTag(e) {
    const id = e.currentTarget.dataset.id;
    const selectedTagIds = this.data.selectedTagIds;
    const index = selectedTagIds.indexOf(id);

    if (index > -1) {
      selectedTagIds.splice(index, 1);
    } else {
      selectedTagIds.push(id);
    }

    this.setData({ selectedTagIds });
  },

  showAddTag() {
    wx.showModal({
      title: '添加标签',
      editable: true,
      placeholderText: '输入标签名称',
      success: async (res) => {
        if (res.content && res.confirm) {
          try {
            const result = await api.tags.create({ name: res.content });
            const newTag = result.data;
            this.setData({
              allTags: [...this.data.allTags, newTag],
              selectedTagIds: [...this.data.selectedTagIds, newTag.id]
            });
            showSuccess('标签已添加');
          } catch (error) {
            showError(error.message || '添加标签失败');
          }
        }
      }
    });
  },

  saveDraft() {
    const draft = {
      title: this.data.title,
      content: this.data.content,
      selectedCategoryId: this.data.selectedCategoryId,
      selectedTagIds: this.data.selectedTagIds,
      updatedAt: Date.now()
    };
    wx.setStorageSync('note_draft', draft);
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
        tagIds: this.data.selectedTagIds,
        summary: content.substring(0, 200)
      };

      if (this.data.id) {
        await api.notes.update(this.data.id, data);
        showSuccess('更新成功');
      } else {
        await api.notes.create(data);
        showSuccess('创建成功');
      }

      wx.removeStorageSync('note_draft');

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
