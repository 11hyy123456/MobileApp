# 学习笔记小程序 - 项目规格说明

## 1. 项目概述

**项目名称**: StudyNotes - 微信小程序学习笔记
**项目类型**: 微信小程序 + Node.js 后端
**核心功能**: 帮助用户记录、管理和回顾学习笔记，支持笔记分类、搜索、全文检索和 Markdown 渲染
**目标用户**: 学生和终身学习者

## 2. 技术架构

### 前端
- **框架**: 微信小程序原生框架 (MINA)
- **UI组件**: Vant Weapp (有赞小程序 UI 库)
- **状态管理**: Mobx-mini
- **Markdown渲染**: parsed-markdown
- **HTTP请求**: Fly.js

### 后端
- **框架**: Express.js 4.x
- **数据库**: SQLite3 (轻量级嵌入式数据库)
- **ORM**: Sequelize
- **认证**: JWT (JSON Web Token)
- **API文档**: Swagger

## 3. 功能模块

### 3.1 用户模块
| 功能 | 描述 |
|------|------|
| 用户注册 | 支持手机号、密码注册 |
| 用户登录 | 支持密码登录，JWT Token 认证 |
| 个人信息 | 查看和修改个人信息 |

### 3.2 笔记模块
| 功能 | 描述 |
|------|------|
| 创建笔记 | 支持 Markdown 编辑，标题、分类、标签 |
| 编辑笔记 | 修改笔记内容 |
| 删除笔记 | 软删除，支持回收站 |
| 笔记列表 | 分页展示，支持分类筛选 |
| 笔记搜索 | 全文检索，关键词高亮 |

### 3.3 分类模块
| 功能 | 描述 |
|------|------|
| 分类管理 | 创建、编辑、删除分类 |
| 分类列表 | 展示所有分类及笔记数量 |

### 3.4 标签模块
| 功能 | 描述 |
|------|------|
| 标签管理 | 创建、删除标签 |
| 标签筛选 | 按标签筛选笔记 |

### 3.5 回顾模块
| 功能 | 描述 |
|------|------|
| 艾宾浩斯回顾 | 根据遗忘曲线提醒复习 |
| 回顾记录 | 记录每次回顾时间和效果 |

## 4. 技术亮点

### 4.1 前端技术亮点
1. **Mobx 状态管理**: 实现可观测的状态管理，支持计算属性和响应式更新
2. **Markdown 即时渲染**: 编辑器和预览模式切换，实时渲染 Markdown
3. **智能搜索**: 支持关键词高亮，搜索历史记录
4. **本地缓存优化**: 使用本地存储缓存笔记，减少网络请求
5. **图片懒加载**: 只加载可视区域内的图片

### 4.2 后端技术亮点
1. **JWT 认证**: 无状态的身份认证机制
2. **Sequelize ORM**: 优雅的数据库操作，支持关联查询
3. **Swagger API文档**: 自动生成 API 文档
4. **SQLite 轻量级**: 无需独立数据库服务，部署简单
5. **统一错误处理**: 中间件统一处理 HTTP 错误

## 5. 项目结构

```
MobileApp/
├── server/                    # 后端项目
│   ├── src/
│   │   ├── config/           # 配置文件
│   │   ├── controllers/      # 控制器
│   │   ├── middleware/       # 中间件
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   └── utils/           # 工具函数
│   └── package.json
├── miniprogram/              # 小程序前端
│   ├── src/
│   │   ├── components/       # 组件
│   │   ├── pages/            # 页面
│   │   ├── stores/           # Mobx stores
│   │   ├── services/         # API 服务
│   │   ├── utils/            # 工具函数
│   │   └── styles/           # 样式
│   ├── app.js
│   └── app.json
└── README.md
```

## 6. 评分要点覆盖

| 评分项 | 实现方式 |
|--------|----------|
| 功能完整性 (20分) | 完整实现用户、笔记、分类、标签、回顾功能 |
| Git 提交历史 (20分) | 规范提交信息，分阶段提交，体现开发过程 |
| 用户体验 (10分) | 精美UI，流畅交互，Vant组件库支持 |
| 技术难度 (10分) | Mobx状态管理，JWT认证，Markdown渲染，全文检索 |
| 项目完整性 (5分) | 前后端分离，结构清晰，文档齐全 |
| 代码质量 (5分) | 模块化设计，命名规范，注释充分 |

## 7. 数据库设计

### 用户表 (users)
- id: INTEGER PRIMARY KEY
- username: STRING (用户名)
- phone: STRING (手机号)
- password: STRING (密码hash)
- avatar: STRING (头像URL)
- created_at: DATETIME
- updated_at: DATETIME

### 笔记表 (notes)
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (外键)
- category_id: INTEGER (外键)
- title: STRING (标题)
- content: TEXT (Markdown内容)
- is_deleted: BOOLEAN (软删除标记)
- next_review_at: DATETIME (下次复习时间)
- created_at: DATETIME
- updated_at: DATETIME

### 分类表 (categories)
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (外键)
- name: STRING (分类名)
- color: STRING (颜色)
- created_at: DATETIME

### 标签表 (tags)
- id: INTEGER PRIMARY KEY
- name: STRING (标签名)
- created_at: DATETIME

### 笔记标签关联表 (note_tags)
- note_id: INTEGER
- tag_id: INTEGER

### 回顾记录表 (reviews)
- id: INTEGER PRIMARY KEY
- note_id: INTEGER (外键)
- review_at: DATETIME (回顾时间)
- effect: INTEGER (效果评分 1-5)
- created_at: DATETIME
