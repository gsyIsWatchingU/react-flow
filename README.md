# React Flow - react-use 实战项目

一个完整的 React + Node.js 全栈项目，展示了 react-use 库在真实业务场景中的最佳实践。

## 🚀 项目启动方式

### 前置要求

- Node.js 18+
- pnpm 8+
- Docker（可选，用于 Redis）

### 安装依赖

```bash
pnpm install
```

### 启动 Redis（可选）

```bash
docker-compose up -d
```

### 一键启动前后端（推荐）

```bash
pnpm dev
```

这将同时启动后端和前端服务：
- 后端服务：`http://localhost:3089`
- 前端应用：`http://localhost:3000`

### 分别启动

如果你想分别启动服务：

**启动后端服务：
```bash
pnpm dev:server
```

**启动前端应用**（新终端）：
```bash
pnpm dev:web
```

### 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@example.com | password |
| 普通用户 | user@example.com | password |

## 🛠️ 技术栈

### 前端

- **React 18** - 用户界面框架
- **Vite** - 构建工具
- **TypeScript** - 类型安全
- **react-use** - React hooks 工具库
- **Zustand** - 状态管理
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **Socket.IO Client** - WebSocket 客户端

### 后端

- **Node.js** - 运行时
- **Express** - Web 框架
- **TypeScript** - 类型安全
- **Socket.IO** - WebSocket 服务
- **express-rate-limit** - 限流中间件
- **Prisma** - ORM
- **CORS** - 跨域支持

### 共享

- **TypeScript** - 类型定义
- **pnpm workspace** - monorepo 管理

## 📁 项目结构

```
react-flow/
├── apps/
│   ├── web/                    # React 前端应用
│   │   ├── src/
│   │   │   ├── pages/          # 页面组件
│   │   │   │   ├── SearchPage.tsx        # 搜索页（useDebounce + useAsync）
│   │   │   │   ├── DashboardPage.tsx     # 数据面板（useThrottle + useIntersection）
│   │   │   │   ├── AdminPage.tsx         # 管理后台（usePermission + PermissionGuard）
│   │   │   │   └── LoginPage.tsx         # 登录页（useLocalStorage）
│   │   │   ├── hooks/          # 自定义 hooks
│   │   │   │   ├── useSearch.ts          # 搜索 hook
│   │   │   │   ├── usePermission.ts      # 权限 hook
│   │   │   │   ├── useInfiniteScroll.ts  # 无限滚动 hook
│   │   │   │   ├── useUserProfile.ts     # 用户信息 hook
│   │   │   │   └── useNotification.ts    # 通知 hook
│   │   │   ├── components/     # UI 组件
│   │   │   │   ├── SearchBar/
│   │   │   │   ├── PermissionGuard/
│   │   │   │   ├── InfiniteList/
│   │   │   │   └── NotificationCenter/
│   │   │   ├── store/          # Zustand 状态
│   │   │   │   ├── authStore.ts
│   │   │   │   └── uiStore.ts
│   │   │   └── services/       # API 服务
│   │   │       ├── apiClient.ts
│   │   │       └── wsClient.ts
│   │   └── package.json
│   │
│   └── server/                 # Node.js 后端服务
│       ├── src/
│       │   ├── routes/         # API 路由
│       │   │   ├── auth.ts
│       │   │   ├── search.ts
│       │   │   ├── users.ts
│       │   │   └── notify.ts
│       │   ├── middleware/     # 中间件
│       │   │   ├── rateLimiter.ts
│       │   │   ├── rbac.ts
│       │   │   └── errorHandler.ts
│       │   └── socket/         # Socket.IO
│       │       └── notifyGateway.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── packages/
│   └── shared-types/           # 前后端共享类型
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## 🎯 项目重难点（值得学习的地方）

### 1. react-use Hooks 实战应用

#### useDebounce + useAsync - 智能搜索
```typescript
// apps/web/src/hooks/useSearch.ts
useDebounce(
  () => setDebouncedQuery(query),
  300,
  [query]
);

const searchAsync = useAsync(async (): Promise<SearchResponse> => {
  // 发起搜索请求
}, [debouncedQuery]);
```
**学习要点**：防抖处理避免频繁请求，useAsync 统一管理 loading/error/data 状态

#### useThrottleFn - 滚动性能优化
```typescript
// apps/web/src/pages/DashboardPage.tsx
const [, handleScroll] = useThrottleFn(
  (e: Event) => setScrollPosition(target.scrollTop),
  200
);
```
**学习要点**：节流限制事件处理频率，优化滚动性能

#### useIntersection - 无限滚动
```typescript
// apps/web/src/hooks/useInfiniteScroll.ts
const intersection = useIntersection(sentinelRef, { threshold: 0.1 });
if (intersection?.isIntersecting && hasMore && !loading) {
  loadItems();
}
```
**学习要点**：监听视口交叉实现无限加载，无需监听 scroll 事件

#### useLocalStorage - 状态持久化
```typescript
// apps/web/src/hooks/usePermission.ts
const [role] = useLocalStorage<Role>('userRole', Role.GUEST);
```
**学习要点**：本地存储管理用户权限，刷新页面不丢失

#### useToggle - 状态开关
```typescript
// apps/web/src/components/NotificationCenter/NotificationCenter.tsx
const [isOpen, toggle] = useToggle(false);
```
**学习要点**：简洁的布尔状态管理

#### useEvent - WebSocket 事件绑定
```typescript
// apps/web/src/hooks/useNotification.ts
useEvent('notification', handleNotification, window);
```
**学习要点**：事件监听器自动清理，避免内存泄漏

### 2. 自定义 Hooks 组合设计

项目展示了如何将 react-use 的基础 hooks 组合成业务专用 hooks：

- **useSearch** - 组合 useDebounce + useAsync
- **useInfiniteScroll** - 组合 useIntersection + useCallback
- **usePermission** - 组合 useLocalStorage + Zustand
- **useNotification** - 组合 useEvent + useEffect

**学习要点**：单一职责原则，每个 hook 只做一件事

### 3. 前后端类型共享

通过 pnpm workspace 实现类型共享，避免重复定义：

```typescript
// packages/shared-types/src/index.ts
export interface User { ... }
export enum Role { ... }
export enum Permission { ... }
```

**学习要点**：类型安全，减少前后端联调成本

### 4. RBAC 权限控制 - 前后端双重保障

**前端**：
- usePermission hook 检查权限
- PermissionGuard 组件条件渲染

**后端**：
- rbacMiddleware 中间件二次校验
- express-rate-limit 防止滥用

**学习要点**：前端做体验优化，后端做安全保障

### 5. Zustand 轻量级状态管理

```typescript
// apps/web/src/store/authStore.ts
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  login: async (credentials) => { ... },
  logout: () => { ... }
}));
```

**学习要点**：简洁的 API，无 Provider 嵌套，性能优异

### 6. WebSocket 实时通知

- 自动连接/断开
- 用户房间管理
- 心跳检测
- 通知队列管理

**学习要点**：WebSocket 与 React hooks 的完美结合

### 7. 服务端限流策略

- 全局限流（15分钟100次）
- 搜索接口特殊限流（每秒2次）

**学习要点**：不同场景不同限流策略

### 8. Monorepo 项目管理

使用 pnpm workspace 管理多包项目：
- 共享依赖提升
- 统一版本管理
- 本地包快速引用

**学习要点**：大型项目的代码组织方式

## 📝 业务功能说明

### 搜索页面
- 输入关键词自动搜索（防抖300ms）
- 显示加载状态和错误信息
- 搜索结果列表展示

### 数据面板
- 滚动位置实时显示（节流200ms）
- 无限滚动列表
- 加载状态指示器

### 管理后台
- 权限验证
- 用户列表展示
- 权限不足提示

### 登录页面
- 用户认证
- Token 持久化
- 角色信息存储

### 通知中心
- 实时通知推送
- 未读计数
- 通知标记已读

## 🎓 学习建议

1. **先看 hooks** - 理解自定义 hooks 如何组合 react-use
2. **再看页面** - 看 hooks 如何在组件中使用
3. **后看后端** - 理解前后端如何配合
4. **动手实践** - 修改代码，观察效果
5. **深入研究** - 查看 react-use 源码，理解实现原理

## 📄 License

MIT
