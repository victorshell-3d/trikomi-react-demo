# ⚛️ 3D Viewer Demo (`3dviewer-demo`) — Public React Reference Suite

[![Platform Ecosystem](https://img.shields.io/badge/Trikomi_Ecosystem-React_Demos-ff69b4?style=for-the-badge)](https://victorshell.com)
[![SDK Version](https://img.shields.io/badge/SDK-v1.0.7--beta-emerald?style=for-the-badge)](https://victorshell.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge)](https://www.typescriptlang.org/)

---

## 📌 Repository Role & Context

This repository (`3dviewer-demo`) provides public, open-source reference implementations built with **React**, **Vite**, and **TypeScript**. It demonstrates how digital agencies and software engineers can integrate the `@trikomi/core` SDK into modern single-page applications (SPAs) and e-commerce web applications.

### 🌐 Trikomi Platform Ecosystem Bridge:
- **`victorshell2`** ([Main Portal](https://victorshell.com)): SaaS dashboard for customer account creation, subscriptions, and API key management.
- **`3dviewer`** (Source SDK Repo): Monorepo source code for `@trikomi/core`, rendering pipelines, and WASM modules.
- **`3dviewer-demo` (This Repository)**: Public React showcase containing 8 ready-to-use e-commerce application templates.
- **`vanilla-demos`** ([Vanilla JS Demos](https://github.com/victorshell-3d/trikomi-vanilla-demo/)): Public zero-framework HTML5/ESM implementation examples for Shopify and WooCommerce themes.

---

## 📦 Application Suite Included

| Application | Path | Key Capabilities |
| :--- | :--- | :--- |
| **Jewelry Configurator** | `apps/jewelry-configurator` | Diamond ring studio, gemstone swatches, ray-traced dispersion, live PDP pricing. |
| **Sportswear Configurator** | `apps/sportswear-configurator` | 3D jersey customizer, dynamic color layers, vector logo positioning & text projection. |
| **Eyewear Try-On** | `apps/eyewear-tryon` | 3D glasses inspector and WebAR try-on studio with snapshot sharing. |
| **Face Motion Capture** | `apps/face-mocap` | Real-time webcam face tracking & 3D AR accessory overlay using MediaPipe. |
| **Box Packaging** | `apps/box-configurator` | 3D die-cut box packaging customizer with folding animations. |
| **360° Virtual Tour** | `apps/360tour` | Hot-spot panorama tour editor and spatial audio viewer. |
| **Multi-Model Inspector** | `apps/viewer` | Standard 3D model inspection studio with HDR environment presets. |

---

## 📊 Current Status (v1.0.7 - Active Beta)

- [x] MobX reactive state management decoupled from 3D viewport canvas.
- [x] Pre-compiled `@trikomi/core` tarball integration (`npm-staging/trikomi-core-1.0.7.tgz`).
- [x] Full TypeScript definitions and React hook abstractions (`useViewer`, `useModel`).

---

## 🛣️ Development Roadmap

- [ ] Cart state integration hooks for Shopify Storefront API and WooCommerce REST API.
- [ ] WebGPU canvas fallback indicators for unsupported legacy browsers.

---

# 🚀 Local Development Setup

```bash
# 1. Install pnpm workspace dependencies
pnpm install

# 2. Start Vite development server
pnpm dev

# 3. Build static distribution bundle for deployment
pnpm build
```

---

## 💬 Community, Feedback & Issues

> [!NOTE]
> Have a feature request, bug report, or idea for improvement? Feel free to open an issue or start a discussion on our GitHub repository. We welcome community feedback and contributions!

---

## 📄 License & Terms

This demonstration software is provided for evaluation and integration reference purposes. For commercial licensing inquiries, enterprise SLAs, or custom 3D configurator development, please visit [victorshell.com](https://victorshell.com).
