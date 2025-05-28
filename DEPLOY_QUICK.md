# 🚀 快速部署到 Cloudflare Pages

## 1. 推送代码到 GitHub

```bash
# 创建 GitHub 仓库后，添加远程地址
git remote add origin https://github.com/yourusername/cover-gen.git
git branch -M main
git push -u origin main
```

## 2. 在 Cloudflare Pages 部署

1. **访问 Cloudflare Dashboard**

   - 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 点击左侧 "Pages"

2. **创建项目**

   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 连接 GitHub 并选择 `cover-gen` 仓库

3. **配置构建设置**

   ```
   Project name: cover-gen
   Production branch: main
   Build command: pnpm build
   Build output directory: dist
   ```

4. **部署**
   - 点击 "Save and Deploy"
   - 等待 2-5 分钟完成构建

## 3. 访问应用

部署完成后，您将获得一个 `.pages.dev` 域名，可以立即访问您的应用！

## 🔧 本地测试构建

在部署前，建议本地测试：

```bash
pnpm build
pnpm preview
```

## 📝 注意事项

- 确保 `pnpm-lock.yaml` 已提交到仓库
- Cloudflare Pages 会自动检测并使用 pnpm
- 构建产物在 `dist/` 目录，已配置在 `.gitignore` 中
- 支持自动部署：推送代码即自动重新部署
