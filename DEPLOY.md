# 英歌舞学习平台 - 部署指南

## 部署架构

```
┌─────────────────┐     ┌─────────────────┐
│    Vercel       │     │    Railway      │
│   (前端 React)   │ --> │   (后端 API)    │
│ yingge-hub.ver  │     │ yingge-api.rail │
└─────────────────┘     └─────────────────┘
```

---

## 第一步：上传代码到 GitHub

### 1.1 在 GitHub 创建仓库

1. 打开 https://github.com
2. 点击右上角 **+** → **New repository**
3. 仓库名称填：`yingge-learning-hub`
4. 选择 **Public**
5. 点击 **Create repository**

### 1.2 推送代码到 GitHub

在项目根目录打开终端，执行：

```bash
cd d:\大三\大三下\非遗\项目\yingge-learning-hub

git init
git add .
git commit -m "Initial commit - 英歌舞学习平台"

git branch -M main
git remote add origin https://github.com/kakaka-123/yingge-learning-hub.git
git push -u origin main
```

⚠️ **如果提示需要登录**：GitHub 需要你登录，可以用以下方法：
- 在浏览器中登录 GitHub
- 或创建 Personal Access Token

---

## 第二步：部署后端到 Railway

### 2.1 创建 Railway 账号

1. 打开 https://railway.app
2. 用 GitHub 账号登录
3. 完成初始设置

### 2.2 部署后端

1. 在 Railway 面板点击 **New Project** → **Deploy from GitHub repo**
2. 选择你的 GitHub 仓库 `kakaka-123/yingge-learning-hub`
3. Railway 会自动检测到 `server` 文件夹

4. **配置环境变量**（在 Railway 项目设置中添加）：

```
NODE_ENV=production
PORT=3001
DEEPSEEK_API_KEY=你的DeepSeek密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

5. 等待部署完成
6. 复制 Railway 给你的域名，例如：`yingge-api.up.railway.app`

### 2.3 更新 Vercel 配置

回到 `vercel.json`，确保 API 地址正确：
```json
"rewrites": [
  {
    "source": "/api/(.*)",
    "destination": "https://你的railway域名.up.railway.app/api/$1"
  }
]
```

---

## 第三步：部署前端到 Vercel

### 3.1 创建 Vercel 账号

1. 打开 https://vercel.com
2. 用 GitHub 账号登录

### 3.2 部署前端

1. 点击 **Add New Project**
2. 选择仓库 `kakaka-123/yingge-learning-hub`
3. 点击 **Import**

4. **配置设置**：
   - Framework Preset: **Vite**
   - Root Directory: `./` (保持默认)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. 点击 **Deploy**

6. 等待部署完成，你会获得一个 URL，例如：`yingge-learning-hub.vercel.app`

---

## 第四步：验证部署

部署完成后，访问你的 Vercel URL：

```
https://yingge-learning-hub.vercel.app
```

测试以下功能：
- ✅ 首页正常显示
- ✅ 导航栏可点击
- ✅ 动作课堂视频播放
- ✅ 鼓点学习音频播放
- ✅ AI 问答功能

---

## 更新代码

以后更新代码后，在 GitHub 推送会自动触发重新部署：

```bash
git add .
git commit -m "更新内容"
git push
```

---

## 常见问题

### Q: Railway 部署失败？

检查：
1. server/package.json 是否存在
2. 环境变量是否配置正确
3. Railway 日志中的错误信息

### Q: API 请求404？

1. 检查 Vercel 的 vercel.json 配置
2. 确认 Railway 后端已启动
3. 检查浏览器控制台的网络请求

### Q: 视频/音频无法加载？

Vercel 对静态文件有限制，大文件建议：
1. 使用云存储（如阿里云OSS）
2. 或使用 Vercel Pro 套餐

---

## 费用说明

- **Vercel**: 免费额度足够个人使用
- **Railway**: 有免费额度，月均$5足够

如需完全免费，可以考虑：
- 前端：Netlify（同样免费）
- 后端：Railway 免费额度 或 Render 免费额度
