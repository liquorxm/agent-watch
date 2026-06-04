# AgentWatch

[中文 README](./README.zh-CN.md)

AgentWatch is a cross-platform desktop app for monitoring local AI agent runtimes.
It helps you see what your agents are doing without turning your desktop into
another command center.

The app runs in the background, detects supported local agent processes, and
surfaces their state through a floating widget, dashboard, system tray, and
native notifications.

## Project Status

AgentWatch is in early MVP development. The current codebase focuses on the
desktop app, local process discovery, agent state modeling, and basic desktop UI
surfaces.

Expect rough edges while the project is still taking shape.

## What It Does

- Detects supported local AI agent processes
- Tracks multiple agents and multiple running instances
- Shows state in a lightweight floating desktop widget
- Provides a dashboard for a broader runtime overview
- Uses system tray and native notifications for background awareness
- Prioritizes non-intrusive monitoring over direct control

## What It Is Not

AgentWatch is not an agent controller, scheduler, or orchestration platform. It
does not run agents for you, send prompts, manage queues, or coordinate tasks
between agents.

The goal is visibility: helping you understand agent runtime state while leaving
agent execution and workflow control to the tools you already use.

## Supported Agents

Current MVP focus:

- Claude Code
- Codex

Planned exploration:

- Gemini CLI
- Aider
- OpenCode
- Cursor Agent
- OpenAI Agent SDK based tools

## Screenshots

Screenshots will be added as the MVP interface stabilizes.

## Tech Stack

- [Tauri 2](https://tauri.app/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

- Node.js
- npm
- Rust and the Tauri system prerequisites for your platform

See the official [Tauri prerequisites](https://tauri.app/start/prerequisites/)
for platform-specific setup.

### Install Dependencies

```bash
npm install
```

### Run the Desktop App

```bash
npm run tauri:dev
```

### Run the Web UI Only

This is useful when working on React views without launching the full desktop
shell.

```bash
npm run dev
```

## Build

Build the frontend:

```bash
npm run build
```

Build the Tauri desktop app:

```bash
npm run tauri:build
```

## Development

Useful commands:

```bash
npm run lint
npm run preview
npm run tauri
```

Project structure:

```text
.
├── src/
│   ├── components/      # Floating widget and dashboard UI
│   ├── core/            # Agent matching, registry, process watching, state engine
│   ├── hooks/           # React hooks for app state and runtime integration
│   ├── services/        # Desktop-facing services such as tray and notifications
│   ├── stores/          # Zustand stores
│   └── types/           # Shared TypeScript types
├── src-tauri/           # Tauri shell, Rust configuration, and desktop bundle setup
├── dashboard.html       # Dashboard entry
├── widget.html          # Floating widget entry
└── vite.config.ts
```

## Roadmap

- Improve Claude Code and Codex process detection
- Expand the floating widget states and display modes
- Add richer dashboard views for multi-agent sessions
- Refine system tray behavior and notification rules
- Improve macOS and Windows packaging
- Explore adapters for more agent runtimes

## Contributing

Contributions are welcome while the project is still young. Good places to help:

- Report detection issues for supported agents
- Share process details for agent tools you want supported
- Improve desktop UI behavior across platforms
- Add focused tests for core state and matching logic
- Open small, well-scoped pull requests

If you are proposing support for a new agent, please include the platform,
process name, command-line shape, and any stable runtime signals the app can use
for detection.

## License

AgentWatch is released under the [MIT License](./LICENSE).
