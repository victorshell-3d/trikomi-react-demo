# 🤖 AGENTS.md — AI & Developer Working Guidelines

[![Repository](https://img.shields.io/badge/Repository-3dviewer--demo-ff69b4?style=for-the-badge)](https://victorshell.com)
[![Role](https://img.shields.io/badge/Role-Public_React_Demos-emerald?style=for-the-badge)](https://victorshell.com)

---

## 📌 Context & Scope
`3dviewer-demo` is a **public open-source reference repository** containing 8 React, Vite, and TypeScript e-commerce application templates powered by the compiled `@trikomi/core` 3D engine package.

---

## 🛡️ Guidelines & Conventions

1. **MobX State Management Decoupling:**
   - Keep 3D engine viewport manipulation (Three.js scene graph, camera animation, material changes) decoupled from React component rendering using MobX observables (`ViewerStore`).
   - Do NOT store heavy 3D mesh instances or WebGL contexts inside React component local state (`useState`).

2. **Package Tarball Dependency:**
   - The `@trikomi/core` SDK is integrated via the local tarball in `npm-staging/trikomi-core-*.tgz`.
   - Do NOT attempt to import raw SDK source code files from outside the workspace.

3. **Public Code Hygiene:**
   - This is a public repository. Never commit proprietary backend API secrets, private keys, or non-public server credentials.

---

## 💻 Build Commands

```bash
pnpm install
pnpm dev
pnpm build
```
