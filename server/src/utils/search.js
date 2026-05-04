const { Op } = require('sequelize');

const searchUtils = {
  highlightText: (text, keyword) => {
    if (!keyword || !text) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  buildSearchQuery: (keyword) => {
    if (!keyword) return {};
    return {
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } },
        { summary: { [Op.like]: `%${keyword}%` } }
      ]
    };
  },

  extractExcerpt: (content, keyword, maxLength = 200) => {
    if (!content) return '';
    if (!keyword) return content.substring(0, maxLength);

    const lowerContent = content.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    const index = lowerContent.indexOf(lowerKeyword);

    if (index === -1) return content.substring(0, maxLength);

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + keyword.length + 150);
    let excerpt = content.substring(start, end);

    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return excerpt;
  }
};

module.exports = searchUtils;
