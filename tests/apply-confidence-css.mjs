import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve('packages/ui-kit/src/styles/viewer-exact.css');
let css = fs.readFileSync(cssPath, 'utf8');

const confidenceCssBlock = `/* --------------------------------------------------------------------------
   5. Configure with Confidence Section (PROMPT 26: 3-Part Composition)
   -------------------------------------------------------------------------- */
.tk-confidence-section {
  position: relative;
  width: 100%;
  background: #020308;
  padding: 40px 0;
  overflow: hidden;
  z-index: 2;
}

.tk-confidence-section::before {
  content: '';
  position: absolute;
  top: -20%;
  left: 10%;
  width: 50%;
  height: 140%;
  background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.18) 0%, transparent 65%);
  pointer-events: none;
  z-index: 1;
}

.tk-confidence-section::after {
  content: '';
  position: absolute;
  top: -10%;
  right: 5%;
  width: 45%;
  height: 120%;
  background: radial-gradient(ellipse at center, rgba(0, 229, 255, 0.12) 0%, transparent 60%);
  pointer-events: none;
  z-index: 1;
}

.tk-confidence-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

/* Left Column: 3D Artwork (35%) */
.tk-confidence-left {
  flex: 0 0 35%;
  max-width: 35%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tk-confidence-artwork {
  width: 100%;
  height: auto;
  max-height: 310px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.35)) drop-shadow(0 0 35px rgba(0, 229, 255, 0.2));
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
  user-select: none;
  pointer-events: none;
  transition: transform 0.4s ease;
}

.tk-confidence-artwork:hover {
  transform: scale(1.02);
}

/* Center Column: Text Content (25%) */
.tk-confidence-center {
  flex: 0 0 25%;
  max-width: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  z-index: 3;
}

.tk-confidence-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 9999px;
  background: rgba(13, 19, 43, 0.7);
  border: 1px solid rgba(168, 85, 247, 0.45);
  box-shadow: 0 0 14px rgba(168, 85, 247, 0.25);
  color: #FFFFFF;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 12px;
  white-space: nowrap;
}

.tk-confidence-title {
  font-size: clamp(24px, 2.3vw, 34px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  margin: 0 0 14px 0;
}

.tk-confidence-title .tk-gradient-confidence {
  background: linear-gradient(135deg, #C084FC 0%, #D946EF 60%, #A855F7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.tk-confidence-desc {
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 20px 0;
  max-width: 280px;
}

.tk-confidence-actions {
  display: flex;
  align-items: center;
}

.tk-confidence-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 22px;
  background: linear-gradient(90deg, #A855F7 0%, #3B82F6 55%, #00E5FF 100%);
  color: #FFFFFF;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  border-radius: 0;
  clip-path: polygon(
    12px 0%,
    100% 0%,
    calc(100% - 12px) 100%,
    0% 100%
  );
  border: none;
  cursor: pointer;
  box-shadow: 0 0 22px rgba(168, 85, 247, 0.6), 0 0 14px rgba(0, 229, 255, 0.4);
  filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.75));
  transition: all 0.25s ease;
  white-space: nowrap;
}

.tk-confidence-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(90deg, #B56BFF 0%, #4E8FFF 55%, #38BDF8 100%);
  filter: drop-shadow(0 0 24px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 18px rgba(0, 229, 255, 0.6));
}

.tk-btn-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.tk-confidence-btn:hover .tk-btn-arrow {
  transform: translateX(3px);
}

/* Right Column: 3D Viewer Interface Preview (40%) */
.tk-confidence-right {
  flex: 0 0 40%;
  max-width: 40%;
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 3;
}

.tk-mockup-frame {
  position: relative;
  width: 100%;
  max-width: 460px;
  aspect-ratio: 1.38 / 1;
  background: rgba(10, 16, 38, 0.75);
  border: 1.5px solid rgba(0, 229, 255, 0.45);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 0 26px rgba(0, 229, 255, 0.22),
    0 0 50px rgba(139, 92, 246, 0.16),
    0 20px 48px rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
}

.tk-mockup-toolbar {
  width: 44px;
  height: 100%;
  background: rgba(6, 10, 26, 0.65);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 0;
  flex-shrink: 0;
  z-index: 5;
}

.tk-mockup-tool-btn {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tk-mockup-tool-btn:hover,
.tk-mockup-tool-btn.is-active {
  color: #00E5FF;
  background: rgba(0, 229, 255, 0.15);
  border-color: rgba(0, 229, 255, 0.4);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.tk-mockup-main {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 14px 14px 14px;
  background: radial-gradient(circle at center, rgba(30, 41, 89, 0.45) 0%, rgba(7, 11, 26, 0.85) 100%);
}

.tk-mockup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 6;
  pointer-events: auto;
}

.tk-mockup-ctrl-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tk-mockup-ctrl-btn:hover {
  background: rgba(0, 229, 255, 0.2);
  border-color: #00E5FF;
  color: #FFFFFF;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
}

.tk-mockup-canvas-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}

.tk-mockup-3d-img {
  max-width: 65%;
  max-height: 65%;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5)) drop-shadow(0 0 10px rgba(0, 229, 255, 0.35));
  transition: transform 0.3s ease, filter 0.3s ease;
}

.tk-mockup-3d-img.is-animating {
  animation: tk-float-knot 4s ease-in-out infinite;
}

@keyframes tk-float-knot {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(4deg);
  }
}

.tk-mockup-3d-img.swatch-silver {
  filter: grayscale(1) brightness(1.2) drop-shadow(0 0 16px rgba(255, 255, 255, 0.5));
}
.tk-mockup-3d-img.swatch-cyan {
  filter: hue-rotate(60deg) drop-shadow(0 0 20px rgba(0, 229, 255, 0.6));
}
.tk-mockup-3d-img.swatch-gold {
  filter: hue-rotate(220deg) saturate(1.4) drop-shadow(0 0 20px rgba(245, 158, 11, 0.6));
}
.tk-mockup-3d-img.swatch-copper {
  filter: hue-rotate(200deg) saturate(1.2) drop-shadow(0 0 20px rgba(234, 88, 12, 0.5));
}
.tk-mockup-3d-img.swatch-obsidian {
  filter: brightness(0.4) contrast(1.4) drop-shadow(0 0 16px rgba(0, 0, 0, 0.8));
}

.tk-mockup-swatches {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  z-index: 6;
  padding-top: 6px;
}

.tk-mockup-sphere {
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.tk-mockup-sphere:hover {
  transform: scale(1.15);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.6), 0 3px 8px rgba(0, 0, 0, 0.6);
}

.tk-mockup-sphere.is-active {
  transform: scale(1.18);
  border-color: #FFFFFF;
  box-shadow: 0 0 0 2px #00E5FF, 0 0 14px rgba(0, 229, 255, 0.8), 0 4px 10px rgba(0, 0, 0, 0.7);
}

/* Swatch Spherical Shaders */
.tk-sphere-silver {
  background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #D8E0EE 40%, #94A3B8 80%, #475569 100%);
}
.tk-sphere-purple {
  background: radial-gradient(circle at 35% 30%, #F0ABFC 0%, #C084FC 35%, #9333EA 75%, #4C1D95 100%);
}
.tk-sphere-cyan {
  background: radial-gradient(circle at 35% 30%, #67E8F9 0%, #06B6D4 35%, #0284C7 75%, #0C4A6E 100%);
}
.tk-sphere-gold {
  background: radial-gradient(circle at 35% 30%, #FEF08A 0%, #F59E0B 40%, #D97706 75%, #78350F 100%);
}
.tk-sphere-copper {
  background: radial-gradient(circle at 35% 30%, #FFEDD5 0%, #FB923C 40%, #EA580C 75%, #7C2D12 100%);
}
.tk-sphere-obsidian {
  background: radial-gradient(circle at 35% 30%, #94A3B8 0%, #475569 35%, #1E293B 75%, #020617 100%);
}

/* Light Mode Overrides */
.tk-viewer-page[data-theme="light"] .tk-confidence-section {
  background: #F8FAFC !important;
}

.tk-viewer-page[data-theme="light"] .tk-confidence-title {
  color: #0F172A !important;
}

.tk-viewer-page[data-theme="light"] .tk-confidence-desc {
  color: #475569 !important;
}

.tk-viewer-page[data-theme="light"] .tk-confidence-badge {
  background: rgba(241, 245, 249, 0.9);
  color: #6B21A8;
  border-color: rgba(168, 85, 247, 0.3);
}

.tk-viewer-page[data-theme="light"] .tk-mockup-frame {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(14, 165, 233, 0.45);
  box-shadow: 0 16px 40px rgba(14, 165, 233, 0.12), 0 0 30px rgba(139, 92, 246, 0.1);
}

.tk-viewer-page[data-theme="light"] .tk-mockup-toolbar {
  background: rgba(241, 245, 249, 0.8);
  border-right-color: rgba(139, 92, 246, 0.15);
}

.tk-viewer-page[data-theme="light"] .tk-mockup-tool-btn {
  color: #475569;
}

.tk-viewer-page[data-theme="light"] .tk-mockup-tool-btn.is-active {
  color: #0284C7;
  background: rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.4);
}

.tk-viewer-page[data-theme="light"] .tk-mockup-ctrl-btn {
  background: rgba(241, 245, 249, 0.8);
  border-color: rgba(139, 92, 246, 0.2);
  color: #334155;
}

.tk-viewer-page[data-theme="light"] .tk-mockup-main {
  background: radial-gradient(circle at center, rgba(238, 242, 255, 0.8) 0%, rgba(241, 245, 249, 0.95) 100%);
}`;

// Find target insertion in viewer-exact.css
const oldExpHeader = `/* --------------------------------------------------------------------------
   5. Real-Time 3D Experience Section
   -------------------------------------------------------------------------- */`;

if (!css.includes(oldExpHeader)) {
  console.error('Could not find oldExpHeader in viewer-exact.css');
  process.exit(1);
}

// Prepend or replace old section block
css = css.replace(oldExpHeader, confidenceCssBlock + '\n\n' + oldExpHeader);

// Also add responsive styles for media queries
const media1024Anchor = `@media (max-width: 1024px) {`;
const media1024Additions = `  .tk-confidence-inner {
    gap: 16px;
  }
  .tk-confidence-left {
    flex: 0 0 32%;
    max-width: 32%;
  }
  .tk-confidence-center {
    flex: 0 0 28%;
    max-width: 28%;
  }
  .tk-confidence-right {
    flex: 0 0 40%;
    max-width: 40%;
  }
`;

css = css.replace(media1024Anchor, media1024Anchor + '\n' + media1024Additions);

const media768Anchor = `@media (max-width: 768px) {`;
const media768Additions = `  .tk-confidence-section {
    padding: 36px 0;
  }
  .tk-confidence-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 28px;
  }
  .tk-confidence-left,
  .tk-confidence-center,
  .tk-confidence-right {
    flex: 0 0 100%;
    max-width: 100%;
    width: 100%;
  }
  .tk-confidence-center {
    align-items: center;
    text-align: center;
  }
  .tk-confidence-desc {
    max-width: 420px;
  }
  .tk-confidence-artwork {
    max-height: 240px;
    -webkit-mask-image: none;
    mask-image: none;
  }
  .tk-mockup-frame {
    max-width: 100%;
  }
`;

css = css.replace(media768Anchor, media768Anchor + '\n' + media768Additions);

const media480Anchor = `@media (max-width: 480px) {`;
const media480Additions = `  .tk-confidence-title {
    font-size: 24px;
  }
  .tk-confidence-btn {
    width: 100%;
    justify-content: center;
  }
  .tk-mockup-frame {
    aspect-ratio: auto;
    min-height: 280px;
  }
`;

css = css.replace(media480Anchor, media480Anchor + '\n' + media480Additions);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated viewer-exact.css with .tk-confidence-* styles and media queries!');
