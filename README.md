# 封面大师 (Cover Master)

专业的微信公众号封面 AI 生成工具

## 🌟 功能特性

- ✅ **多 AI 模型支持** - 支持 GPT-4o 和 SeedDream 3.0 模型
- ✅ **统一 DMX API 接入** - 简单易用，国内访问稳定
- ✅ **智能提示词生成** - 内置多种风格模板
- ✅ **批量生成** - 一次生成 1-4 张封面
- ✅ **一键下载/复制** - 便捷的图片操作
- ✅ **响应式设计** - 支持桌面端和移动端

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 开始使用

### 构建生产版本

```bash
pnpm build
```

## 🔧 配置说明

### 获取 DMX API Key

1. 访问 [DMX API 官网](https://www.dmxapi.cn)
2. 注册账号并登录
3. 进入控制台获取 API Key
4. 充值账户余额（按使用量计费）

### 模型选择

- **GPT-4o Image**: 最高质量，适合精细创作
- **SeedDream 3.0**: 中文理解佳，性价比高，推荐使用

## 📱 使用指南

1. **配置 API** - 在左侧面板输入 DMX API Key 并选择模型
2. **描述封面** - 详细描述你想要的封面内容、风格、色彩
3. **选择数量** - 设置要生成的封面数量（1-4 张）
4. **生成封面** - 点击生成按钮，等待 AI 创作
5. **下载使用** - 选择满意的封面进行下载或复制链接

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS + Headless UI
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **图标库**: Lucide React
- **动画库**: Framer Motion
- **构建工具**: Vite
- **包管理器**: pnpm

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # 基础UI组件
│   ├── layout/         # 布局组件
│   ├── config/         # 配置组件
│   └── generation/     # 生成相关组件
├── stores/             # 状态管理
│   ├── config.ts       # 配置状态
│   └── generation.ts   # 生成状态
├── services/           # API服务
│   ├── dmx-api.ts      # DMX API 服务
│   └── config.ts       # 配置管理
├── types/              # TypeScript类型
│   ├── api.ts          # API相关类型
│   └── app.ts          # 应用类型
├── utils/              # 工具函数
│   ├── validation.ts   # 验证工具
│   └── storage.ts      # 存储工具
└── styles/             # 样式文件
```

## 🔒 安全特性

- API Key 本地加密存储
- 输入验证和 XSS 防护
- HTTPS 强制使用
- 敏感信息脱敏处理

## 📊 性能优化

- 代码分割和懒加载
- 图片懒加载
- 智能缓存策略
- 防抖节流优化

## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 邮箱: support@covermaster.com
- 官网: https://covermaster.com

---

© 2024 封面大师 Cover Master. 让创作更简单！
