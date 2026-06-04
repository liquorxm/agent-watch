# AgentWatch

[English README](./README.md)

AgentWatch 是一款跨平台桌面应用，用于监控本地 AI Agent 的运行状态。它帮助你在不打断当前工作的情况下，看见本地 Agent 正在做什么。

应用会在后台运行，发现受支持的本地 Agent 进程，并通过悬浮组件、仪表盘、系统托盘和原生通知展示状态。

## 项目状态

AgentWatch 目前处于早期 MVP 开发阶段。当前代码主要聚焦桌面端应用、本地进程发现、Agent 状态建模，以及基础桌面 UI。

项目仍在快速成形中，部分体验和接口可能会持续调整。

## 它能做什么

- 发现受支持的本地 AI Agent 进程
- 跟踪多个 Agent 类型和多个运行实例
- 通过轻量悬浮组件展示桌面状态
- 通过仪表盘提供更完整的运行概览
- 使用系统托盘和原生通知提供后台状态感知
- 优先做非侵入式监控，而不是直接控制 Agent

## 它不是什么

AgentWatch 不是 Agent 控制器、调度器或编排平台。它不会替你运行 Agent、发送 prompt、管理任务队列，或协调多个 Agent 之间的任务。

它的目标是可见性：帮助你理解 Agent 的运行状态，同时把执行和工作流控制留给你已经在使用的工具。

## 支持的 Agent

当前 MVP 优先支持：

- Claude Code
- Codex

后续计划探索：

- Gemini CLI
- Aider
- OpenCode
- Cursor Agent
- 基于 OpenAI Agent SDK 的工具

## 截图

MVP 界面稳定后会补充截图。

## 技术栈

- [Tauri 2](https://tauri.app/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)

## 快速开始

### 环境要求

- Node.js
- npm
- Rust，以及当前平台所需的 Tauri 系统依赖

不同平台的具体配置请参考官方 [Tauri prerequisites](https://tauri.app/start/prerequisites/)。

### 安装依赖

```bash
npm install
```

### 运行桌面应用

```bash
npm run tauri:dev
```

### 只运行 Web UI

如果只调试 React 视图，不需要启动完整桌面壳，可以使用：

```bash
npm run dev
```

## 构建

构建前端：

```bash
npm run build
```

构建 Tauri 桌面应用：

```bash
npm run tauri:build
```

## 开发

常用命令：

```bash
npm run lint
npm run preview
npm run tauri
```

项目结构：

```text
.
├── src/
│   ├── components/      # 悬浮组件和仪表盘 UI
│   ├── core/            # Agent 匹配、注册、进程监听和状态引擎
│   ├── hooks/           # React hooks
│   ├── services/        # 托盘、通知等桌面服务
│   ├── stores/          # Zustand 状态管理
│   └── types/           # 共享 TypeScript 类型
├── src-tauri/           # Tauri 桌面壳、Rust 配置和打包设置
├── dashboard.html       # 仪表盘入口
├── widget.html          # 悬浮组件入口
└── vite.config.ts
```

## 路线图

- 改进 Claude Code 和 Codex 进程识别
- 扩展悬浮组件状态和展示模式
- 为多 Agent 会话增加更丰富的仪表盘视图
- 优化系统托盘行为和通知规则
- 改进 macOS 和 Windows 打包体验
- 探索更多 Agent runtime 适配器

## 贡献

欢迎参与这个仍处于早期阶段的项目。比较适合贡献的方向包括：

- 反馈已支持 Agent 的识别问题
- 提供希望支持的 Agent 工具进程信息
- 改进跨平台桌面 UI 行为
- 为核心状态和匹配逻辑补充聚焦测试
- 提交范围清晰的小型 pull request

如果你希望添加新的 Agent 支持，请尽量提供平台、进程名、命令行形态，以及可用于识别的稳定运行时信号。

## License

AgentWatch 基于 [MIT License](./LICENSE) 开源。
