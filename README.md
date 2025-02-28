# MI-AI Project

一个基于 TypeScript 的全栈 AI 应用项目。

## 项目架构

本项目使用 pnpm workspace 管理的 monorepo 结构，包含以下主要部分：

### 应用 (apps)

- `apps/web`: 前端应用
  - 基于 React + TypeScript
  - 使用 Vite 作为构建工具
  - 集成了 Tailwind CSS 进行样式管理
  - 包含可复用的 UI 组件库

- `apps/server`: 后端服务
  - 基于 Node.js + TypeScript
  - 使用 tsup 进行构建
  - 处理 AI 相关的业务逻辑
  - 管理历史记录和数据存储

### 共享包 (packages)

- `packages/shared`: 共享工具和类型
  - 包含前后端共用的类型定义
  - 共享的工具函数和常量

## 开发指南

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 开发命令

前端开发：
```bash
pnpm --filter web dev
```

后端开发：
```bash
pnpm --filter server dev
```

### 构建项目

```bash
pnpm build
```

## 项目结构

```
mi-ai/
├── apps/
│   ├── server/        # 后端服务
│   │   ├── src/
│   │   └── data/     # 数据存储
│   └── web/          # 前端应用
│       ├── src/
│       └── components/
├── packages/
│   └── shared/       # 共享包
└── package.json
```

## 配置说明

1. 环境变量
   - 在项目根目录或各个应用目录下创建 `.env` 文件
   - 参考 `.env.example` 文件进行配置

2. 开发配置
   - TypeScript 配置位于各个项目的 `tsconfig.json`
   - 前端样式配置位于 `apps/web/tailwind.config.js`

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'feat: add some feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 许可证

[MIT License](LICENSE)