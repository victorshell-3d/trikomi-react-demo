# ⚛️ Architecture & Integration Guide — Trikomi React Demos

### 🌐 Trikomi Platform Ecosystem Bridge:
- **`victorshell2`** ([SaaS Portal Architecture](file:///media/vijaykc/projects/victorshell2/ARCHITECTURE.md)): Main SaaS website, user authentication, subscription management, and Super Admin License Manager.
- **`3dviewer`** ([Source SDK Architecture](file:///media/vijaykc/projects/3dviewer/ARCHITECTURE.md)): Monorepo source code for `@trikomi/core` rendering engines and WASM modules.
- **`3dviewer-demo` (This Repository)**: Public React & TypeScript reference applications.
- **`vanilla-demos`** ([Vanilla Demos Architecture](file:///media/vijaykc/projects/vanilla-demos/ARCHITECTURE.md)): Public zero-framework HTML5/ESM showcase hosted live on GitHub Pages.

## 1. Overview
The `3dviewer-demo` repository contains production-ready reference applications built with **React 19**, **TypeScript**, and **Vite**. It demonstrates how enterprise B2B clients should integrate the `@trikomi/core` 3D engine into modern React environments, utilizing MobX for high-performance state binding.

## 2. Architecture & Design Patterns

```
   ┌──────────────────────┐          ┌──────────────────────┐
   │  React UI Components │          │    MobX Store        │
   │  (Material UI / CSS) │◄────────►│ (viewerStore state)  │
   └──────────────────────┘          └──────────┬───────────┘
                                                │ Two-way binding
                                                ▼
                                     ┌──────────────────────┐
                                     │  @trikomi/core SDK   │
                                     │  (WebGPU Renderer)   │
                                     └──────────────────────┘
```

### A. Modular App Structure
Instead of a single monolithic app, this repository is organized as a workspace containing distinct, industry-specific configurators:
- `apps/jewelry-configurator/`: Demonstrates advanced ray-traced diamond shaders, Bloom plugins, and material swapping.
- `apps/sportswear-configurator/`: Demonstrates dynamic texture compositing, mapping 2D logos and SVG decals onto 3D UV coordinates.
- `apps/box-configurator/`: Demonstrates parametric geometry manipulation for packaging.

### B. State Management (MobX)
The applications leverage MobX to reactively bind the 3D engine's internal state to the React UI. By utilizing `useViewerStore()`, components can observe loading progress, active materials, and environmental settings without manual event listeners, ensuring UI updates are synchronous with the render loop.

### C. The On-Demand Rendering Pattern
To optimize battery life and GPU usage on client devices, these applications heavily rely on the `enableOnDemandRendering` architecture. The WebGL canvas remains completely idle (0% GPU usage) until the user interacts with the scene or a reactive MobX state change requests a frame.

## 3. Directory Layout
```
3dviewer-demo/
├── apps/
│   ├── jewelry-configurator/      # Luxury ring & diamond PDP studio
│   ├── sportswear-configurator/   # 3D sportswear customizer & logo placement
│   ├── box-configurator/          # Parametric 3D packaging configurator
│   └── viewer/                    # Generic standard 3D model viewer
├── packages/
│   └── core/                      # (NPM Dependency stub or linked local package)
├── ARCHITECTURE.md                # Architecture documentation
└── package.json                   # Workspace configuration
```

## 4. Build & Deployment
Each app is compiled individually via Vite. The routing and static asset paths are configured using `vite.config.ts` to ensure compatibility with sub-directory deployments (like GitHub Pages).

```bash
# Install dependencies
pnpm install

# Build specific configurator
pnpm --filter jewelry-configurator build

# Run local development server
pnpm --filter jewelry-configurator dev
```
