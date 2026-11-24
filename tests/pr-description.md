## Summary
This Pull Request implements the approved VictorShell landing page design system across all seven 3D configurators, standardizes components using `@trikomi/ui-kit`, resolves critical 3D engine lifecycle exceptions (DEF-01 `runtimeRoot` unmount error), and aligns all visual assets, footers, theme modes, and responsive viewports to production specifications.

---

## Changes Made

### 1. Unified VictorShell Design System (`packages/ui-kit/`)
- **Approved Theme Tokens**: Implemented Pearl White (`#F9F9FF`), Soft Lavender (`#EDE5FF`), Ice Blue (`#EAF1FF`), and Electric Purple (`#7628D9`).
- **Shared UI Kit**: Unified navbar, glassmorphism cards, glowing feature badges, responsive action docks, and typography (`Plus Jakarta Sans`).
- **Footer Standardization (PROMPT 41 & 04)**: Reduced footer height across all pages by ~20% (~308px desktop), removed the redundant "3D PLATFORM" column, and evenly distributed remaining columns.

### 2. Configurator Landing Pages (`apps/*` & `packages/ui-kit/src/components/landing/`)
- **Jewelry Configurator (`apps/jewelry-configurator/`)**: Added 3D ring hero visual, procedural diamond shading, and material color swatches.
- **Eyewear Virtual Try-On (`apps/eyewear-tryon/`)**: Fixed missing showcase product images across all 3 curated collection tabs (`optical-prescription`, `sun-polarized`, `sport-aerodynamic`) with high-resolution vector visuals (PROMPT 39).
- **Box / Packaging Configurator (`apps/box-configurator/`)**: Recreated full approved reference layout (PROMPT 01), 3D packaging showcase, dimensional inputs, and material presets.
- **Face Motion Capture (`apps/face-mocap/`)**: Implemented cartoon raccoon hero visual with 50/50 split facial landmark tracking mesh and expression selector (PROMPT 37).
- **360° Virtual Tour (`apps/360tour/`)**: Standardized Equirectangular Spherical Engine and Interactive Hotspot Node Graph cards to matching dimensions (PROMPT 03).
- **3D Product Viewer (`apps/viewer/`)**: Implemented approved landing layout, model inspection toolbar, lighting, and camera reset controls (PROMPT 36).
- **Sportswear Configurator (`apps/sportswear-configurator/`)**: Integrated dynamic jersey customizer and material options.

### 3. DEF-01 RuntimeRoot Lifecycle Bug Fix
- **Root Cause**: When users rapidly navigated between the landing page (`#/`) and live 3D demo (`#demo`), `viewer.dispose()` detached plugins and set `this.viewer = void 0` while asynchronous model loaders (`ring.glb`, `glasses1.glb`) were still downloading. Upon resolution, accessing `this.viewer.runtimeRoot` threw `TypeError: Cannot read properties of undefined (reading 'runtimeRoot')`.
- **Resolution (`apps/eyewear-tryon/src/ThreeD.jsx`, `apps/jewelry-configurator/src/components/Playground.tsx`, `MaterialControls.tsx`)**:
  - Implemented `isMounted` state tracking and `activeLoadId` cancellation.
  - Attached safe detached viewer stubs to `onDetach` for `EyewearPlugin` and `GLTFPlugin`, preventing late-resolving promises from accessing `undefined`.
  - Added optional chaining and unmount guards inside material discovery timeouts.
  - Completely resolved with **0 core engine modifications** (preserving `@trikomi/core` freeze).

---

## Verification & Testing

1. **Automated QA Suite (`tests/run-full-qa.mjs`)**:
   - **7 of 7 Applications PASSED**.
   - **0 Console Errors** across all 7 applications.
   - **0 Failed Asset Requests**.
   - **Light / Dark Theme Switching**: Verified functional across all landing pages.
2. **DEF-01 Rapid Route Switching Test**:
   - 5 consecutive rapid route toggles (`#/` ↔ `#demo`) under 75ms: **0 `runtimeRoot` errors**.
   - Normal unhurried 3D model loading: Canvas active and rendered successfully on Jewelry and Eyewear.
3. **Responsive Audits**:
   - Verified across 4 viewports: **1920x1080** (Desktop), **1366x768** (Laptop), **768x1024** (Tablet), and **390x844** (Mobile).
   - Zero horizontal overflow (`scrollWidth === clientWidth`).
4. **Production Monorepo Build**:
   - Executed `pnpm run build` (`node build-monorepo.js`); all 7 applications compiled cleanly with exit code `0`.

---

## Key Screenshots & Documentation

- **Eyewear Fixed Showcase**: `public/qa-screenshots/eyewear-tryon-1920.png`
- **Box Configurator Hero**: `public/images/box-hero-main.png`
- **Face Mocap Split Visual**: `public/images/raccoon-mocap-hero.png`
- **Final Verification Report**: `tests/final-verification-report.md`
- **Comprehensive QA Report**: `tests/final-qa-report.md`
