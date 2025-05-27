# 微信公众号封面生成器 - 设计文档

## 项目概述

**产品名称**: 封面大师 (Cover Master)  
**产品定位**: 专业的微信公众号封面 AI 生成工具  
**目标用户**: 微信公众号运营者、内容创作者、设计师  
**核心价值**: 快速、智能、专业的封面生成体验

## 设计理念

### 设计原则

- **简洁高效**: 减少用户操作步骤，专注核心功能
- **专业可信**: 体现 AI 技术的先进性和生成结果的专业性
- **中文友好**: 针对中文用户的使用习惯和审美偏好
- **响应式设计**: 支持桌面端和移动端使用

### 设计风格

- **现代简约**: 采用扁平化设计语言，注重留白和层次
- **科技感**: 融入渐变、毛玻璃效果等现代 UI 元素
- **专业性**: 使用规范的栅格系统和一致的视觉语言

## 视觉设计

### 配色方案

**主色调**:

- 主色: `#6366F1` (现代紫蓝色) - 体现 AI 科技感
- 辅助色: `#8B5CF6` (深紫色) - 用于强调和渐变
- 成功色: `#10B981` (翠绿色) - 成功状态提示
- 警告色: `#F59E0B` (橙黄色) - 警告提示
- 错误色: `#EF4444` (红色) - 错误状态

**中性色**:

- 深色文字: `#1F2937`
- 中等文字: `#6B7280`
- 浅色文字: `#9CA3AF`
- 边框色: `#E5E7EB`
- 背景色: `#F9FAFB`
- 纯白: `#FFFFFF`

**渐变色**:

- 主渐变: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`
- 背景渐变: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### 字体系统

**中文字体**:

```css
font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
  "WenQuanYi Micro Hei", sans-serif;
```

**英文字体**:

```css
font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
```

**字体层级**:

- H1: 32px/1.2, font-weight: 700
- H2: 24px/1.3, font-weight: 600
- H3: 20px/1.4, font-weight: 600
- Body: 16px/1.5, font-weight: 400
- Small: 14px/1.4, font-weight: 400
- Caption: 12px/1.3, font-weight: 400

## 页面布局结构

### 整体布局

```
┌─────────────────────────────────────────┐
│                Header                    │
├─────────────────────────────────────────┤
│                                         │
│              Main Content               │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Control   │  │     Preview     │   │
│  │    Panel    │  │      Area       │   │
│  │             │  │                 │   │
│  └─────────────┘  └─────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│                Footer                   │
└─────────────────────────────────────────┘
```

### 响应式断点

- Desktop: ≥ 1024px
- Tablet: 768px - 1023px
- Mobile: < 768px

## API 配置设计

### 1. 统一 API 服务 - DMX API

**为什么选择 DMX API？**

- 🌐 国内访问稳定，无需科学上网
- 🤖 支持多个主流 AI 模型
- 💰 性价比高，按需付费
- 🔧 OpenAI 兼容格式，开发简单
- 📚 完善的文档和技术支持

**支持的模型**:

- `gpt-image-1` - OpenAI 的图像生成模型，质量最高
- `seedream-3.0` - 国产优秀图像生成模型，中文理解佳

**API 规格**:

- **端点**: `https://www.dmxapi.cn/v1/images/generations`
- **认证**: Bearer Token
- **格式**: OpenAI 兼容

### 2. 简化配置界面

#### 2.1 配置表单设计

```typescript
interface DmxApiConfig {
  apiKey: string;
  model: "gpt-image-1" | "seedream-3.0";
}

const supportedModels = [
  {
    id: "gpt-image-1",
    name: "OpenAI GPT4o Image",
    description: "最高质量，适合精细创作",
    recommended: true,
  },
  {
    id: "seedream-3.0",
    name: "SeedDream 3.0",
    description: "中文理解佳，国产优选",
  },
];
```

#### 2.2 用户界面元素

- **API Key 输入**: 密码输入框，支持显示/隐藏，带验证状态
- **模型选择**: 卡片式选择器，显示模型特点和推荐标签
- **连接测试**: 一键验证 API 可用性
- **使用指南**: 内置获取 API Key 的详细步骤

### 3. DMX API 集成

#### 3.1 API 调用实现

```typescript
interface ImageGenerationRequest {
  prompt: string;
  model: string;
  size: string;
  n: number;
  seed?: number;
}

interface ImageGenerationResponse {
  success: boolean;
  data?: {
    images: Array<{
      url: string;
      b64_json?: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

class DmxApiService {
  private readonly API_HOST = "www.dmxapi.cn";
  private readonly API_ENDPOINT = "/v1/images/generations";

  constructor(private apiKey: string) {}

  async generateImage(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResponse> {
    const payload = {
      prompt: request.prompt,
      n: 1, // DMX API 固定为 1
      model: request.model,
      size: request.size,
      seed: request.seed || -1, // -1 表示随机
    };

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
      "User-Agent": "DMXAPI/1.0.0 (https://www.dmxapi.cn)",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(
        `https://${this.API_HOST}${this.API_ENDPOINT}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          images: data.data || [],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "API_ERROR",
          message: error.message,
        },
      };
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const testRequest: ImageGenerationRequest = {
        prompt: "测试图片",
        model: "gpt-image-1",
        size: "1024x1024",
        n: 1,
      };

      const result = await this.generateImage(testRequest);
      return result.success;
    } catch {
      return false;
    }
  }
}
```

#### 3.2 配置管理

```typescript
interface DmxApiConfig {
  apiKey: string;
  model: string;
}

class ConfigManager {
  private readonly STORAGE_KEY = 'dmx_api_config';

  async saveConfig(config: DmxApiConfig): Promise<void> {
    // 简单加密存储
    const encrypted = btoa(JSON.stringify(config));
    localStorage.setItem(this.STORAGE_KEY, encrypted);
  }

  async loadConfig(): Promise<DmxApiConfig | null> {
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEY);
      if (!encrypted) return null;

      const decrypted = atob(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

    clearConfig(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

  async testConnection(config: ApiConfig): Promise<boolean> {
    // 测试 API 连接
  }
}
```

## 功能模块设计

### 1. Header 区域

**组件**:

- Logo + 产品名称
- 导航菜单 (使用指南、关于我们)
- 主题切换按钮 (可选)

**设计要点**:

- 高度: 64px
- 背景: 白色 + 轻微阴影
- Logo 采用渐变色设计

### 2. 控制面板 (左侧)

**宽度**: 360px (桌面端)

#### 2.1 API 配置区域

```
┌─────────────────────────────┐
│  🔧 DMX API 配置            │
├─────────────────────────────┤
│  🔑 API Key                 │
│  [输入框]            [验证] │
│  ✅ 已连接 / ❌ 未验证      │
│                             │
│  🤖 AI 模型选择             │
│  ┌─────────┐ ┌─────────┐   │
│  | GPT4o   │ │SeedDream│   │
│  │ 推荐 ⭐ │ │  中文佳  │   │
│  └─────────┘ └─────────┘   │
│                             │
│  💡 如何获取API Key?        │
└─────────────────────────────┘
```

#### 2.2 内容描述区域

```
┌─────────────────────────────┐
│  ✏️ 描述你的封面             │
├─────────────────────────────┤
│  [多行文本输入框]           │
│  提示: 详细描述封面内容、    │
│  风格、色彩等要求           │
│                             │
│  📝 智能提示词              │
│  [预设模板选择]             │
└─────────────────────────────┘
```

#### 2.3 生成设置区域

```
┌─────────────────────────────┐
│  ⚙️ 生成设置                │
├─────────────────────────────┤
│  生成数量: [1] [2] [3] [4]  │
│                             │
│  图片尺寸: 900×388 (固定)   │
│                             │
│  [🎨 高级设置]              │
└─────────────────────────────┘
```

#### 2.4 操作按钮

```
┌─────────────────────────────┐
│  [🚀 开始生成封面]          │
│                             │
│  生成历史 📋                │
└─────────────────────────────┘
```

### 3. 预览区域 (右侧)

#### 3.1 空状态

```
┌─────────────────────────────────────┐
│                                     │
│         🎨                          │
│    开始创作你的封面                  │
│                                     │
│   在左侧输入描述，点击生成           │
│   即可看到AI为你创作的精美封面       │
│                                     │
└─────────────────────────────────────┘
```

#### 3.2 生成中状态

```
┌─────────────────────────────────────┐
│                                     │
│         ⏳                          │
│    AI正在为你创作封面...             │
│                                     │
│   [进度条动画]                      │
│   预计需要 15-30 秒                 │
│                                     │
└─────────────────────────────────────┘
```

#### 3.3 结果展示

```
┌─────────────────────────────────────┐
│  🎉 生成完成！                      │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ 封面 1  │  │ 封面 2  │          │
│  │ 900x388 │  │ 900x388 │          │
│  │ [预览]  │  │ [预览]  │          │
│  │ 📋 🔽   │  │ 📋 🔽   │          │
│  └─────────┘  └─────────┘          │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ 封面 3  │  │ 封面 4  │          │
│  │ 900x388 │  │ 900x388 │          │
│  │ [预览]  │  │ [预览]  │          │
│  │ 📋 🔽   │  │ 📋 🔽   │          │
│  └─────────┘  └─────────┘          │
│                                     │
│  [🔄 重新生成] [💾 批量下载]        │
└─────────────────────────────────────┘
```

## UI 组件设计

### 1. 按钮组件

```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
}

/* 次要按钮 */
.btn-secondary {
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  border-radius: 8px;
  padding: 10px 22px;
}
```

### 2. 输入框组件

```css
.input-field {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input-field:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
```

### 3. 卡片组件

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
}
```

## 交互设计

### 1. 微交互动效

- **按钮悬停**: 轻微放大 (scale: 1.02) + 阴影加深
- **卡片悬停**: 向上浮动 2px + 阴影扩散
- **输入框聚焦**: 边框颜色渐变 + 外发光效果
- **加载动画**: 脉冲效果 + 渐变色旋转

### 2. 状态反馈

- **成功状态**: 绿色勾选图标 + 成功提示
- **错误状态**: 红色警告图标 + 错误信息
- **加载状态**: 骨架屏 + 进度指示器
- **空状态**: 插画 + 引导文案

### 3. 操作流程

```
用户输入 → 参数验证 → 显示加载 → API调用 → 结果展示 → 操作选择
    ↓           ↓           ↓          ↓          ↓          ↓
  实时提示   错误提示   进度动画   错误处理   成功反馈   功能引导
```

## 功能特性

### 1. 核心功能

- ✅ 多 AI 模型支持 (GPT-4o + SeedDream)
- ✅ 统一 DMX API 接入，简单易用
- ✅ 智能提示词生成
- ✅ 批量生成 (1-4 张)
- ✅ 一键复制/下载
- ✅ 生成历史记录

### 2. 增强功能

- 🔄 图片重新生成
- 📱 移动端适配
- 🌙 深色模式 (可选)
- 💾 本地存储配置
- 📊 使用统计

### 3. 用户体验

- ⚡ 快速响应 (<200ms)
- 🎯 智能错误处理
- 💡 操作引导提示
- 🔒 数据安全保护

## 技术要求

### 1. 前端技术栈

```json
{
  "framework": "React 18 + TypeScript",
  "styling": "Tailwind CSS + Headless UI",
  "state": "Zustand",
  "http": "Axios",
  "icons": "Lucide React",
  "animations": "Framer Motion",
  "build": "Vite",
  "package_manager": "pnpm"
}
```

### 2. 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # 基础UI组件
│   ├── forms/          # 表单组件
│   ├── layout/         # 布局组件
│   └── config/         # 配置组件
├── pages/              # 页面组件
├── hooks/              # 自定义Hooks
├── services/           # API服务
│   ├── dmx-api.ts      # DMX API 服务
│   └── config.ts       # 配置管理
├── stores/             # 状态管理
│   ├── config.ts       # 配置状态
│   └── generation.ts   # 生成状态
├── utils/              # 工具函数
│   ├── validation.ts   # 验证工具
│   └── storage.ts      # 存储工具
├── types/              # TypeScript类型
│   ├── api.ts          # API相关类型
│   └── app.ts          # 应用类型
└── styles/             # 样式文件
```

### 3. 性能优化

- 🚀 代码分割 (React.lazy)
- 📦 资源压缩 (Gzip)
- 🖼️ 图片懒加载
- 💾 智能缓存策略
- ⚡ 防抖节流优化

### 4. 安全考虑

- 🔐 API Key 本地加密存储 (AES-256)
- 🛡️ XSS 防护和输入验证
- 🔒 HTTPS 强制使用
- 🚫 敏感信息过滤和脱敏
- 🌐 API 端点验证和白名单
- 🔑 API Key 格式验证
- 📝 请求日志脱敏处理
- ⚠️ 错误信息安全处理

## 移动端适配

### 1. 布局调整

- 单列布局 (控制面板在上，预览在下)
- 底部固定操作栏
- 侧滑菜单 (可选)

### 2. 交互优化

- 触摸友好的按钮尺寸 (44px+)
- 手势操作支持
- 虚拟键盘适配

### 3. 性能优化

- 图片压缩
- 懒加载优化
- 网络状态检测

## DMX API 使用指南

### 1. 获取 API Key

1. 访问 [DMX API 官网](https://www.dmxapi.cn)
2. 注册账号
3. 在控制台创建应用，获取 API Key
4. 充值账户余额（按使用量计费）

### 2. 模型选择建议

- **GPT-4o**: 适合需要最高质量的精细创作
- **SeedDream 3.0**: 中文提示词理解更佳，适合中文内容

### 3. 成本优化

- 建议默认使用 SeedDream 3.0，性价比最高
- 重要封面使用 GPT-4o 确保质量

### 4. 技术特点

- 固定尺寸 900×388，完美适配微信公众号
- 支持中文提示词，理解更准确
- 响应速度快，通常 15-30 秒完成
- 稳定可靠，国内访问无障碍

---
