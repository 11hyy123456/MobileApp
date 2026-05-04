{
  "name": "StudyNotes",
  "version": "1.0.0",
  "description": "微信小程序学习笔记 - 基于艾宾浩斯遗忘曲线的智能复习系统",
  "scripts": {
    "server": "cd server && npm install && npm start",
    "miniprogram": "打开微信开发者工具导入 miniprogram 目录"
  },
  "features": [
    "用户认证 (JWT)",
    "笔记管理 (CRUD + Markdown)",
    "分类和标签系统",
    "全文搜索",
    "艾宾浩斯复习提醒",
    "回收站功能"
  ],
  "tech_stack": {
    "frontend": "微信小程序原生框架",
    "backend": "Express.js + Sequelize ORM",
    "database": "SQLite3",
    "auth": "JWT"
  },
  "rating_points": {
    "功能完整性": "20分 - 核心功能完整实现",
    "Git提交历史": "20分 - 规范提交信息",
    "用户体验": "10分 - 精美UI和流畅交互",
    "技术难度": "10分 - Mobx状态管理、JWT认证、Markdown渲染",
    "项目完整性": "5分 - 前后端结构完整",
    "代码质量": "5分 - 模块化、命名规范"
  }
}
