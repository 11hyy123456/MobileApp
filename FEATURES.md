# 学习笔记小程序 - 功能说明文档

## 项目概述
StudyNotes 是一款微信小程序学习笔记应用，帮助用户高效记录、管理和复习学习内容。

## 技术架构
- **前端**: 微信小程序原生框架 (MINA)
- **后端**: Express.js + Sequelize ORM
- **数据库**: SQLite3
- **认证**: JWT (JSON Web Token)

---

## 页面功能详解

### 1. 首页 (pages/index/index)
**功能**: 展示学习统计数据、快捷操作入口、最近笔记预览
- 显示笔记总数、待复习数、分类数、连续学习天数
- 快捷操作入口：新建笔记、搜索笔记、开始复习、分类管理
- 最近笔记预览（最近5条）
- 未登录用户显示登录引导

### 2. 登录页面 (pages/login/login)
**功能**: 用户登录
- 用户名密码输入
- JWT Token 认证
- 登录成功后自动跳转首页

### 3. 注册页面 (pages/register/register)
**功能**: 新用户注册
- 用户名、密码、确认密码验证
- 手机号可选填写
- 注册成功后自动登录

### 4. 笔记列表 (pages/note/list/list)
**功能**: 展示和管理用户所有笔记
- 笔记列表展示（标题、摘要、分类、标签）
- 分类筛选
- 标签筛选
- 关键词搜索
- 排序功能（最新/最早）
- 分页加载
- 右上角新建按钮

### 5. 笔记详情 (pages/note/detail/detail)
**功能**: 展示笔记完整内容
- Markdown 内容渲染
- 分类和标签展示
- 复习提醒信息
- 操作栏：编辑、分享、收藏、删除
- 立即复习按钮

### 6. 笔记编辑 (pages/note/edit/edit)
**功能**: 创建和编辑笔记
- Markdown 编辑器
- 三种模式切换：编辑、预览、分屏
- Markdown 快捷工具栏（粗体、斜体、代码、列表）
- 分类选择
- 标签选择和添加
- 自动保存草稿

### 7. 复习页面 (pages/review/list/list)
**功能**: 基于艾宾浩斯遗忘曲线的复习管理
- 待复习笔记列表
- 今日已复习数量
- 连续学习天数统计
- 即将到期笔记预览
- 点击跳转到笔记详情进行复习

### 8. 分类管理 (pages/category/list/list)
**功能**: 管理笔记分类
- 分类列表展示
- 新建分类
- 编辑分类名称
- 删除分类（笔记保留）

### 9. 标签管理 (pages/tag/list/list)
**功能**: 管理笔记标签
- 标签列表展示
- 新建标签
- 删除标签
- 标签使用数量统计

### 10. 个人中心 (pages/profile/profile)
**功能**: 用户个人信息和设置
- 头像和用户名展示
- 统计数据展示
- 入口：回收站、分类管理、标签管理
- 编辑资料
- 关于页面
- 退出登录

### 11. 搜索页面 (pages/search/search)
**功能**: 全站搜索笔记
- 实时搜索（防抖处理）
- 搜索历史记录
- 关键词高亮
- 按标题和内容搜索

### 12. 回收站 (pages/trash/trash)
**功能**: 管理已删除的笔记
- 回收站列表展示
- 恢复笔记功能
- 永久删除功能

---

## 后端 API 接口

### 认证接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /auth/register | POST | 用户注册 |
| /auth/login | POST | 用户登录 |
| /auth/profile | GET | 获取个人信息 |
| /auth/profile | PUT | 更新个人信息 |

### 笔记接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /notes | GET | 获取笔记列表（支持分页、筛选、搜索） |
| /notes | POST | 创建笔记 |
| /notes/:id | GET | 获取笔记详情 |
| /notes/:id | PUT | 更新笔记 |
| /notes/:id | DELETE | 删除笔记（软删除） |
| /notes/:id/recover | POST | 恢复笔记 |
| /notes/:id/review | POST | 记录复习 |
| /notes/due-reviews | GET | 获取待复习笔记 |

### 分类接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /categories | GET | 获取分类列表 |
| /categories | POST | 创建分类 |
| /categories/:id | PUT | 更新分类 |
| /categories/:id | DELETE | 删除分类 |

### 标签接口
| 接口 | 方法 | 说明 |
|------|------|------|
| /tags | GET | 获取标签列表 |
| /tags | POST | 创建标签 |
| /tags/:id | DELETE | 删除标签 |
| /tags/:id/notes | GET | 获取指定标签下的笔记 |

---

## 技术亮点

### 前端技术亮点
1. **Mobx 状态管理**: 实现可观测的状态管理，支持计算属性和响应式更新
2. **Markdown 即时渲染**: 编辑器和预览模式切换，实时渲染 Markdown
3. **智能搜索**: 防抖处理，搜索历史记录，关键词高亮
4. **本地缓存优化**: 草稿自动保存，减少网络请求
5. **分页加载**: 支持上拉加载更多

### 后端技术亮点
1. **JWT 认证**: 无状态的身份认证机制，支持 Token 过期自动处理
2. **Sequelize ORM**: 优雅的数据库操作，支持关联查询和预加载
3. **SQLite 轻量级**: 无需独立数据库服务，部署简单
4. **统一错误处理**: 中间件统一处理 HTTP 错误，友好的错误信息
5. **Swagger API文档**: 自动生成 API 文档

---

## 数据库设计

### 用户表 (users)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| username | STRING | 用户名 |
| phone | STRING | 手机号 |
| password | STRING | 密码哈希 |
| avatar | STRING | 头像URL |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 笔记表 (notes)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 用户ID |
| category_id | INTEGER | 分类ID |
| title | STRING | 标题 |
| content | TEXT | Markdown内容 |
| summary | STRING | 摘要 |
| is_deleted | BOOLEAN | 是否删除 |
| next_review_at | DATETIME | 下次复习时间 |
| review_count | INTEGER | 复习次数 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 分类表 (categories)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| user_id | INTEGER | 用户ID |
| name | STRING | 分类名 |
| color | STRING | 颜色 |

### 标签表 (tags)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| name | STRING | 标签名 |
| color | STRING | 颜色 |

### 笔记-标签关联表 (note_tags)
| 字段 | 类型 | 说明 |
|------|------|------|
| note_id | INTEGER | 笔记ID |
| tag_id | INTEGER | 标签ID |

### 复习记录表 (reviews)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| note_id | INTEGER | 笔记ID |
| review_at | DATETIME | 复习时间 |
| effect | INTEGER | 效果评分(1-5) |

---

## 艾宾浩斯复习算法

复习间隔遵循艾宾浩斯遗忘曲线：
- 第1次复习：1天后
- 第2次复习：2天后
- 第3次复习：4天后
- 第4次复习：7天后
- 第5次复习：15天后
- 第6次复习：30天后

用户每次复习后，系统会根据复习效果自动安排下次复习时间。
