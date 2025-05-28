# 变更日志

## [1.1.0] - 2025-01-XX

### 新增功能

#### 🔄 多模型输出格式适配

- **自动适配不同 AI 模型的输出格式**
  - SeedDream 3.0: 直接返回图片 URL
  - OpenAI GPT-4o Image: 返回 base64 编码数据
  - 系统自动检测并转换为统一格式

#### 📥 增强的下载功能

- **智能下载策略**
  - 优先使用 base64 原始数据（更高质量）
  - 备用 URL 下载方式
  - 自动错误处理和重试机制

### 🐛 问题修复

#### 📐 图片尺寸修正

- **修复图片生成尺寸问题**

  - 从 1024×1024 修正为微信公众号标准尺寸 900×388
  - 确保下载的图片就是正确的微信封面尺寸
  - 预览区域已正确显示 900:388 比例

- **智能尺寸回退机制**

  - 如果 API 不支持 900×388，自动尝试备用尺寸
  - 支持的尺寸优先级：900×388 → 1024×1024 → 512×512
  - 自动检测尺寸相关错误并进行回退

- **前端图片处理**
  - 新增图片裁剪和处理工具 (`src/utils/image-processor.ts`)
  - 自动将方形图片裁剪为微信封面比例
  - 保持图片质量的智能裁剪算法
  - 支持 Canvas 处理和 blob URL 生成

#### 🔧 技术改进

- **新增类型定义**

  - `ImageResult` 接口支持 URL 和 base64 数据
  - 更新 `GenerationHistory` 支持完整图片数据
  - 增强类型安全性

- **Base64 转换功能**
  - 自动将 base64 数据转换为 blob URL
  - 支持图片预览和下载
  - 内存管理优化（自动清理 blob URL）

### 技术细节

#### API 响应处理

```typescript
// 新增的响应处理逻辑
private async processImageResponse(images: any[], model: string) {
  // SeedDream: 直接使用 URL
  // OpenAI: base64 → blob URL 转换
}

private base64ToBlobUrl(base64Data: string): string {
  // 安全的 base64 到 blob URL 转换
  // 包含错误处理和备用方案
}
```

#### 下载功能增强

```typescript
const handleDownload = async (imageResult: ImageResult) => {
  // 优先使用 base64 数据（如果可用）
  if (imageResult.b64_json) {
    // 直接从 base64 创建 blob
  } else {
    // 从 URL 获取图片数据
  }
};
```

### 用户体验改进

- ✅ 无缝支持两种模型，用户无需关心底层差异
- ✅ 更高质量的图片下载（使用原始 base64 数据）
- ✅ 更好的错误处理和用户反馈
- ✅ 详细的调试日志便于问题排查

### 兼容性

- ✅ 向后兼容现有功能
- ✅ 支持所有现代浏览器
- ✅ 自动降级处理（base64 → data URL）

### 文档更新

- 📚 更新 `TROUBLESHOOTING.md` 添加模型格式差异说明
- 📚 添加技术实现细节和调试指南
- 📚 提供不同模型的使用建议

---

## [1.0.0] - 2025-01-XX

### 初始版本

- 🎨 完整的微信公众号封面生成器
- 🤖 支持 DMX API 多模型调用
- 📱 响应式设计，支持桌面和移动端
- 🔧 API Key 配置和验证
- 📝 智能提示词模板
- 📥 图片下载和复制功能
- 📊 生成历史记录
- 🎯 专业的错误处理和用户反馈
