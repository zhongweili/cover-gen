# Cloudflare Pages 部署指南

## 🚀 部署到 Cloudflare Pages

### 前置条件

1. **Cloudflare 账户**：注册 [Cloudflare](https://dash.cloudflare.com/sign-up) 账户
2. **Git 仓库**：将代码推送到 GitHub、GitLab 或 Bitbucket
3. **构建工具**：确保本地可以正常运行 `pnpm build`

### 步骤 1: 准备代码仓库

```bash
# 1. 初始化 Git 仓库（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交代码
git commit -m "Initial commit: WeChat cover generator"

# 4. 添加远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/yourusername/cover-gen.git

# 5. 推送到远程仓库
git push -u origin main
```

### 步骤 2: 在 Cloudflare Pages 创建项目

1. **登录 Cloudflare Dashboard**

   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 登录您的账户

2. **创建 Pages 项目**

   - 点击左侧菜单 "Pages"
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接 Git 仓库**

   - 选择您的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 授权 Cloudflare 访问您的仓库
   - 选择 `cover-gen` 仓库

4. **配置构建设置**

   ```
   Project name: cover-gen
   Production branch: main
   Build command: pnpm build
   Build output directory: dist
   Root directory: (留空)
   ```

5. **环境变量**（可选）

   - 如果需要设置环境变量，在 "Environment variables" 部分添加

6. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成（通常 2-5 分钟）

### 步骤 3: 配置自定义域名（可选）

1. **添加自定义域名**

   - 在项目设置中点击 "Custom domains"
   - 点击 "Set up a custom domain"
   - 输入您的域名

2. **DNS 配置**
   - 如果域名在 Cloudflare 管理：自动配置
   - 如果域名在其他服务商：按提示添加 CNAME 记录

### 步骤 4: 验证部署

1. **访问网站**

   - 使用 Cloudflare 提供的 `.pages.dev` 域名
   - 或您配置的自定义域名

2. **测试功能**
   - 检查页面加载是否正常
   - 测试 API 配置功能
   - 验证图片生成流程

## 🔧 构建配置详解

### Vite 配置

项目使用 Vite 作为构建工具，配置文件 `vite.config.ts`：

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react", "framer-motion"],
        },
      },
    },
  },
});
```

### 构建优化

- **代码分割**：自动分离 vendor 和 UI 库
- **资源压缩**：CSS 和 JS 自动压缩
- **缓存策略**：通过 `_headers` 文件配置
- **SPA 路由**：通过 `_redirects` 文件支持

## 🌐 部署后配置

### 性能优化

1. **启用 Cloudflare 优化**

   - Auto Minify: HTML, CSS, JS
   - Brotli 压缩
   - HTTP/2 和 HTTP/3

2. **缓存配置**
   - 静态资源：1 年缓存
   - HTML 文件：1 小时缓存
   - API 响应：根据需要配置

### 安全设置

1. **安全头**

   - 已通过 `_headers` 文件配置
   - X-Frame-Options, CSP 等

2. **HTTPS**
   - Cloudflare 自动提供 SSL 证书
   - 强制 HTTPS 重定向

## 🔄 持续部署

### 自动部署

- **推送触发**：每次推送到 main 分支自动部署
- **预览部署**：Pull Request 自动创建预览环境
- **回滚**：可以快速回滚到之前的版本

### 部署钩子

```bash
# 部署前钩子（可选）
pnpm run lint
pnpm run test

# 构建命令
pnpm build

# 部署后钩子（可选）
# 发送通知、清理缓存等
```

## 📊 监控和分析

### Cloudflare Analytics

- **访问统计**：页面浏览量、独立访客
- **性能指标**：加载时间、Core Web Vitals
- **地理分布**：访客地理位置分析

### 错误监控

- **构建日志**：查看构建过程和错误
- **运行时错误**：通过浏览器控制台监控
- **性能监控**：使用 Cloudflare Web Analytics

## 🚨 故障排除

### 常见问题

1. **构建失败**

   ```bash
   # 本地测试构建
   pnpm build

   # 检查依赖
   pnpm install
   ```

2. **路由问题**

   - 确保 `_redirects` 文件存在
   - 检查 SPA 路由配置

3. **API 调用失败**

   - 检查 CORS 设置
   - 验证 API 端点可访问性

4. **静态资源 404**
   - 检查构建输出目录
   - 验证资源路径配置

### 调试技巧

```bash
# 本地预览构建结果
pnpm build
pnpm preview

# 检查构建产物
ls -la dist/

# 分析构建大小
npx vite-bundle-analyzer
```

## 📝 部署清单

- [ ] 代码推送到 Git 仓库
- [ ] Cloudflare Pages 项目创建
- [ ] 构建配置正确
- [ ] 部署成功
- [ ] 功能测试通过
- [ ] 性能优化启用
- [ ] 自定义域名配置（可选）
- [ ] 监控和分析设置

## 🔗 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [React 部署最佳实践](https://create-react-app.dev/docs/deployment/)
