# 🏛️ Architecture & Integration Guide — Trikomi 3D React Demo Suite

### 🌐 Trikomi Platform Ecosystem Bridge:
- **`victorshell2`** ([SaaS Portal Architecture](file:///media/vijaykc/projects/victorshell2/ARCHITECTURE.md)): Main SaaS website, user authentication, subscription management, and Super Admin License Manager.
- **`3dviewer`** ([Source SDK Architecture](file:///media/vijaykc/projects/3dviewer/ARCHITECTURE.md)): Monorepo source code for `@trikomi/core` rendering engines and WASM security modules.
- **`3dviewer-demo` (This Repository)**: Public React & TypeScript reference applications.
- **`vanilla-demos`** ([Vanilla Demos Architecture](file:///media/vijaykc/projects/vanilla-demos/ARCHITECTURE.md)): Public zero-framework HTML5/ESM showcase hosted live on GitHub Pages.

## 1. Overview
The `3dviewer-demo` repository provides enterprise-grade, public React reference implementations. It demonstrates how to integrate the compiled `@trikomi/core` WebGPU 3D engine into modern React, Vite, and TypeScript applications.

## 2. Architecture & Design Patterns

```
                                ┌─────────────────────────┐
                                │   React View Components │
                                │  (JSX / MUI Controls)   │
                                └────────────┬────────────┘
                                             │ MobX Reactions
                                             ▼
                                ┌─────────────────────────┐
                                │   MobX Reactive Store   │
                                │ (ViewerStore / Config)  │
                                └────────────┬────────────┘
                                             │ Imperative API
                                             ▼
                                ┌─────────────────────────┐
                                │   ThreeViewer Engine    │
                                │    (@trikomi/core)      │
                                └─────────────────────────┘
```

### A. Decoupled MobX State Management
Application state (colors, materials, pricing, active model, sidebar visibility) is stored inside MobX observables (`ViewerStore`). React components observe these stores, ensuring the 3D WebGL/WebGPU viewport updates imperatively without causing unnecessary React re-renders.

### B. Pre-Compiled SDK Integration
To protect core IP, the rendering engine source is compiled and imported as a local package target specified in `package.json`:
```json
"@trikomi/core": "file:./npm-staging/trikomi-core-1.0.7.tgz"
```

### C. Modular Plugin System
Viewports interact with the core engine through modular plugins:
- `GLTFPlugin`: Asynchronous GLTF/GLB model loading and mesh hierarchy parsing.
- `EnvironmentPlugin`: Equirectangular HDR/EXR reflection map management.
- `DiamondPlugin`: Ray-traced diamond dispersion node overrides.
- `BloomPlugin`: Post-processing bloom render passes.

### D. License Validation & Multi-Site Configuration
To authenticate premium WASM features (such as the `DiamondPlugin` or mathematical decaling functions), the host application must provide a cryptographic license via the global `window.trikomi_config` object (`{ apiKey, fallbackJwt }`).

**Main-Domain Architecture:** The `@trikomi/core` SDK validates licenses on the **root main-domain** level. The internal WASM security engine strips away subdomains and TLDs (e.g. `shop.brand.co.uk` maps to `brand`). This design grants clients full flexibility, allowing them to use their single license seamlessly across staging environments, multiple storefronts, and regional top-level domains without experiencing validation failures or needing distinct seats.

## 3. Directory Layout
```
3dviewer-demo/
├── apps/                        # Production React / Vite demonstration apps
│   ├── 360tour/                 # Virtual 360 tour editor
│   ├── 8theye/                  # WebAR eyewear try-on app
│   ├── box-configurator/        # 3D packaging customizer
│   ├── eyewear-tryon/           # Named eyewear preview and try-on studio
│   ├── face-mocap/              # Real-time AR webcam facial tracking
│   ├── jewelry-configurator/    # Luxury ring & diamond studio
│   ├── sportswear-configurator/ # 3D sportswear customizer
│   └── viewer/                  # Multi-model 3D inspection studio
├── npm-staging/                 # Pre-compiled single @trikomi/core SDK tarball
├── public/                      # Shared static assets (3D models, EXR environments)
└── ARCHITECTURE.md              # Architecture documentation
```
