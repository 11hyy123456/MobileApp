const api = require('../../../services/api');
const { showLoading, hideLoading, showError, showSuccess, formatDate, relativeTime } = require('../../../utils/index');

Page({
  data: {
    note: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.loadNote(options.id);
    }
  },

  async loadNote(id) {
    this.setData({ loading: true });
    try {
      const res = await api.notes.detail(id);
      const note = res.data;

      note.htmlContent = this.parseMarkdown(note.content);
      note.formattedDate = formatDate(note.createdAt);
      note.relativeReviewDate = relativeTime(note.nextReviewAt);

      this.setData({ note, loading: false });
    } catch (error) {
      showError('加载笔记失败');
      wx.navigateBack();
    }
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

  goToEdit() {
    const note = this.data.note;
    wx.navigateTo({ url: `/pages/note/edit/edit?id=${note.id}` });
  },

  async deleteNote() {
    const res = await wx.showModal({
      title: '确认删除',
      content: '确定要删除这篇笔记吗？删除后会进入回收站',
      confirmColor: '#ff4d4f'
    });

    if (res.confirm) {
      try {
        await api.notes.delete(this.data.note.id);
        showSuccess('删除成功');
        wx.navigateBack();
      } catch (error) {
        showError('删除失败');
      }
    }
  },

  toggleStar() {
    const note = this.data.note;
    note.isStarred = !note.isStarred;
    this.setData({ note });
    showSuccess(note.isStarred ? '已收藏' : '已取消收藏');
  },

  shareNote() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  startReview() {
    wx.navigateTo({
      url: `/pages/review/review?noteId=${this.data.note.id}`
    });
  }
});
