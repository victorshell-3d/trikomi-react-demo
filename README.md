# Trikomi 3D Platform — React & Web App Showcase

[![Trikomi 3D Platform](https://img.shields.io/badge/Trikomi_3D_Platform-WebGPU_Engine-6366f1?style=for-the-badge)](https://victorshell.com)
[![SDK Version](https://img.shields.io/badge/SDK-v1.0.6-emerald?style=for-the-badge)](https://victorshell.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge)](https://www.typescriptlang.org/)

Welcome to the **Trikomi 3D Platform** public demonstration monorepo. This repository provides enterprise-grade reference implementations built with **React**, **Vite**, and **TypeScript**, demonstrating how to integrate high-performance 3D visualization, real-time Augmented Reality (AR), and product customization into web applications.

---

## 🎯 Purpose & Executive Summary

The purpose of this public demonstration suite is to provide software architects and frontend engineers with production-ready, open-source application templates powered by the compiled `@trikomi/core` WebGPU 3D Engine.

### Key Objectives:
- **Accelerate Enterprise Integration**: Reduce time-to-market by providing copy-paste React component patterns for complex 3D viewports, AR face tracking, and dynamic product customization.
- **Demonstrate High-Performance WebGPU Render Pipeline**: Showcases real-time Physically Based Rendering (PBR), Bloom post-processing, screen-space reflections (SSR), and diamond dispersion shaders executing at 60 FPS in standard web browsers.
- **Decoupled Architecture**: Demonstrates clean state management using MobX reactivity, completely separating 3D engine scene graphs from application UI logic.

---

## 📦 Monorepo Application Architecture

This workspace is organized as a unified `pnpm` monorepo containing 8 production-grade applications:

| Application | Description | Technology Stack |
| :--- | :--- | :--- |
| **`apps/sportswear-configurator`** | Interactive 3D athletic apparel customizer with real-time vector logo positioning, text projection, dynamic color swatches, and fabric texture compositing. | React, MobX, `@trikomi/core/sportswear` |
| **`apps/face-mocap`** | Real-time browser-based webcam facial tracking and AR accessory overlay engine powered by MediaPipe. Features aspect-ratio matching and unmirrored UI text overlays. | React, MediaPipe, `@trikomi/core/face-mocap` |
| **`apps/jewelry-configurator`** | Luxury e-commerce Studio for diamond rings featuring ray-traced internal refraction, dispersion shaders, gemstone finishes, and real-time PDP price calculation. | React, `@trikomi/core/jewelry` |
| **`apps/box-configurator`** | Interactive 3D packaging and die-cut box configurator with dynamic dimension controls, folding animations, and custom print export. | React, Konva 2D, `@trikomi/core/box` |
| **`apps/360tour`** | Virtual tour creator and interactive panorama viewer supporting hot-spot navigation, floor plans, and spatial audio. | React, `@trikomi/core/tour` |
| **`apps/eyewear-tryon`** | 3D glasses previewer and named AR try-on studio with glassmorphic UI controls and snapshot captures. | React, `@trikomi/core/eyewear` |
| **`apps/8theye`** | WebAR eyewear virtual try-on studio integrated with 8thWall surface tracking. | React, 8thWall, `@trikomi/core/8thwall` |
| **`apps/viewer`** | Generic multi-model 3D inspection studio with environment lighting presets, material slot editing, and camera animation controls. | React, `@trikomi/core` |

---

## 📁 Repository Structure

```
3dviewer-demo/
├── apps/                        # Production React / Vite demonstration applications
│   ├── 360tour/                 # Virtual 360 tour editor and viewer
│   ├── 8theye/                  # 8thWall WebAR eyewear try-on app
│   ├── box-configurator/        # 3D packaging and die-cut configurator
│   ├── eyewear-tryon/           # Named eyewear preview and try-on studio
│   ├── face-mocap/              # Real-time AR webcam facial tracking
│   ├── jewelry-configurator/    # Luxury ring & diamond dispersion studio
│   ├── sportswear-configurator/ # 3D sportswear customizer & logo placement
│   └── viewer/                  # Multi-model 3D inspection studio
├── npm-staging/                 # Pre-compiled single @trikomi/core SDK tarball (.tgz)
├── public/                      # Shared static assets (3D models, EXR environments)
├── docs/                        # API documentation and integration guides
├── pnpm-workspace.yaml          # Workspace configuration sharing root node_modules
├── package.json                 # Monorepo root configuration with local dependency overrides
└── README.md                    # Repository documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (`npm i -g pnpm`)

### 1. Installation
Clone the repository and install shared workspace dependencies:
```bash
git clone https://github.com/your-org/trikomi-demo-react.git
cd trikomi-demo-react
pnpm install
```

### 2. Running Local Development Server
Launch the unified development environment:
```bash
pnpm dev
```
Navigate to `http://localhost:3000` to access the main application landing portal.

### 3. Building for Production
To build all applications into a consolidated static distribution folder:
```bash
pnpm build
```
The compiled output will be generated in `./dist`, ready for deployment to any CDN or static hosting platform (e.g. Vercel, AWS S3, Cloudflare Pages).

---

## 🛡️ Intellectual Property Notice

This repository contains public demonstration applications. To protect proprietary intellectual property, the core engine source code (`packages/core/src`) is omitted. The 3D engine is distributed as a pre-compiled, security-verified SDK contained in `npm-staging/trikomi-core-*.tgz`.

---

## 📄 License & Terms

This demonstration software is provided for evaluation and integration reference purposes. For commercial licensing inquiries, enterprise SLAs, or custom 3D configurator development, please visit [victorshell.com](https://victorshell.com).
