# 1. 应用概览

Book Favorites 是一个前后端分离的图书收藏应用：

- 前端：Vite + React + TypeScript + Redux Toolkit，负责页面路由、登录态、图书列表、收藏列表和用户交互。
- 后端：Express + TypeScript REST API，负责注册、登录、图书查询、收藏读写和 JWT 鉴权。
- 数据层：没有数据库，后端同步读写 `backend/data/*.json`。
- 测试：后端使用 Jest + Supertest，端到端测试使用 Playwright。
- Infra：支持本地 npm 启动，也支持 Docker Compose 编排 backend、frontend 和 test 三个服务。


# 2. 仓库代码结构

```text
.
├── package.json                 # npm workspaces 和根级脚本
├── docker-compose.yml           # backend/frontend/test 服务编排
├── dockerfile-backend           # 后端生产镜像
├── dockerfile-frontend          # 前端 nginx 镜像
├── dockerfile-test              # Playwright 测试镜像
├── nginx.conf                   # 前端静态托管和 /api 反向代理
├── run-e2e.sh                   # Playwright E2E 启动器
├── backend/
│   ├── server.ts                # Express runtime 入口
│   ├── types.ts                 # 后端共享类型和 Express Request 扩展
│   ├── tsconfig.json            # 后端含测试的类型检查配置
│   ├── tsconfig.build.json      # 后端生产构建配置
│   ├── jest.config.js           # Jest + ts-jest 配置
│   ├── data/                    # books/users 以及 test-* JSON 数据
│   ├── routes/                  # API router factories
│   └── tests/                   # Jest + Supertest API 测试
└── frontend/
    ├── index.html               # Vite HTML 入口
    ├── vite.config.ts           # Vite dev server、proxy、preview 配置
    ├── playwright.config.ts     # Playwright E2E 配置
    ├── tsconfig.json            # 前端 TypeScript 配置
    ├── src/
    │   ├── main.tsx             # React mount 入口
    │   ├── App.tsx              # Provider、Router、页面路由
    │   ├── api.ts               # API URL 构造
    │   ├── types.ts             # 前端共享类型
    │   ├── components/          # 页面和导航组件
    │   ├── store/               # Redux Toolkit store 与 slices
    │   └── styles/              # CSS Modules 和全局样式
    └── tests/e2e/               # Playwright E2E 测试
```
