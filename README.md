# AI简历分析系统

本项目为一套基于 React + Node.js + MongoDB 的 AI 简历分析与知识库管理平台，支持多项目文档管理、AI对话、知识库检索、数据上传、AI切片等功能，适用于企业级简历与文档智能处理场景。

---

## 目录结构

```
项目根目录/
├── backend/           # Node.js + Express 后端服务
│   ├── app.js         # 后端主入口
│   ├── config.js      # MongoDB 配置
│   ├── models/        # Mongoose 数据模型
│   ├── routes/        # 路由（文件、项目等）
│   ├── controllers/   # 控制器（如有）
│   ├── uploads/       # 上传文件存储目录
│   └── package.json   # 后端依赖
├── frontend/          # React 前端项目
│   ├── public/        # 静态资源（含fonts目录）
│   ├── src/           # 前端源码
│   ├── fonts/         # 字体文件（建议放到public/fonts下）
│   └── package.json   # 前端依赖
```

---

## 环境依赖

- Node.js 16+
- npm 8+
- MongoDB 4.0+
- 推荐操作系统：Windows 10/11 或 macOS/Linux

---

## 安装与部署步骤

### 1. 克隆项目

```bash
git clone <你的仓库地址>
cd 项目根目录
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 安装前端依赖

```bash
cd ../frontend
npm install
```

### 4. 配置数据库

- 默认配置在 `backend/config.js`，如需修改数据库地址请编辑此文件：
  ```js
  module.exports = {
    mongoUri: 'mongodb://localhost:27017/ai_resume'
  };
  ```
- 启动本地 MongoDB 服务（默认端口 27017）。

### 5. 启动后端服务

```bash
cd backend
node app.js
```
- 后端服务默认运行在 [http://localhost:4000](http://localhost:4000)

### 6. 启动前端服务

```bash
cd frontend
npm start
```
- 前端服务默认运行在 [http://localhost:3000](http://localhost:3000)
- 已配置代理，前端 API 请求会自动转发到后端 4000 端口

### 7. 字体文件部署

- 请将所需字体（如 `simsun.ttc`）放入 `frontend/public/fonts/` 目录
- 在 `frontend/src/index.css` 中用如下方式引入：
  ```css
  @font-face {
    font-family: 'Simsun';
    src: url('/fonts/simsun.ttc') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  ```

---

## 常见问题

- **前端字体不生效？**
  - 请确保字体文件放在 `frontend/public/fonts/` 下，并用 `/fonts/xxx` 路径引用。
  - 建议使用 `.ttf` 或 `.woff` 格式提升兼容性。

- **上传/下载文件乱码？**
  - 已在后端处理中文文件名，若仍有问题请检查数据库和前端显示。

- **端口冲突？**
  - 可在 `package.json` 或启动命令中修改端口。

- **MongoDB 连接失败？**
  - 请确认本地 MongoDB 服务已启动，且 `config.js` 配置正确。

---

## 其它说明

- 如需部署到生产环境，建议用 `npm run build` 构建前端静态文件，并用 Nginx/PM2 等托管。
- 后端如需 HTTPS、鉴权、AI模型等功能可按需扩展。

---

如有更多问题或定制需求，请联系项目开发者。 