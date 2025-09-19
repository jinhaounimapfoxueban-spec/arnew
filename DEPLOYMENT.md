# 部署指南

## 前端部署 (Netlify)

1. 将代码推送到GitHub仓库
2. 登录 [Netlify](https://netlify.com)
3. 选择 "Import from Git"
4. 选择你的仓库
5. 构建设置：
   - Build command: (留空)
   - Publish directory: `frontend`
6. 点击 "Deploy"

## 后端部署 (Railway)

1. 安装 Railway CLI: `npm i -g @railway/cli`
2. 登录: `railway login`
3. 初始化: `railway init`
4. 部署: `railway up`

## 环境变量配置

### Netlify 环境变量
- `VITE_API_URL`: 后端API地址
- `ENABLE_CAMERA`: 是否启用相机功能

### Railway 环境变量
- `PORT`: 服务器端口
- `MONGODB_URI`: 数据库连接字符串
- `JWT_SECRET`: JWT密钥
