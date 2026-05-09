# 图书收藏应用

这是一个全栈图书收藏应用，包含前端页面和后端 API。

## 项目功能

- 用户注册与登录
- 浏览图书列表
- 将图书加入个人收藏
- 查看个人收藏列表
- 登录后访问受保护的图书和收藏页面

## 本地启动

安装依赖：

```bash
npm install
cd frontend
npm run playwright:install
cd ..
```

启动后端服务：

```bash
npm run start:backend
```

后端默认运行在 `http://localhost:4000`。

另开一个终端启动前端：

```bash
npm run start:frontend
```

前端默认运行在 `http://localhost:5173`。

可使用示例账号 `sandra` / `sandra` 登录，或注册新账号。

## 部署方式

使用 Docker Compose 构建并启动前后端容器：

```bash
docker compose up --build -d
```

默认访问地址：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:4000`

如端口被占用，可在启动时指定宿主机端口：

```bash
BACKEND_HOST_PORT=4001 FRONTEND_HOST_PORT=5174 docker compose up --build -d
```

停止服务：

```bash
docker compose down
```
