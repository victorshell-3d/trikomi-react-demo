import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve('packages/ui-kit/src/styles/viewer-exact.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace main .tk-cta-card rules
const oldCtaCardBlock = `/* Compact CTA Banner Card - Exact 3.7:1 Aspect Ratio Matching Reference */
.tk-cta-card {
  position: relative;
  width: 100%;
  aspect-ratio: 3.7 / 1;
  min-height: 220px;
  max-height: 330px;
  border-radius: 20px;
  overflow: hidden;
  background: #020308 url('/images/viewer-cta-banner-bg.png') no-repeat center / cover;
  border: 1px solid rgba(0, 229, 255, 0.35);
  box-shadow: 
    0 0 24px rgba(0, 229, 255, 0.16), 
    0 0 45px rgba(139, 92, 246, 0.2), 
    0 16px 40px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  isolation: isolate;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tk-cta-card:hover {
  box-shadow: 
    0 0 32px rgba(0, 229, 255, 0.28), 
    0 0 60px rgba(139, 92, 246, 0.28), 
    0 20px 48px rgba(0, 0, 0, 0.8);
}

.tk-viewer-page[data-theme="light"] .tk-cta-card {
  border: 1px solid rgba(0, 229, 255, 0.35);
  box-shadow: 
    0 0 24px rgba(0, 229, 255, 0.16), 
    0 0 45px rgba(139, 92, 246, 0.2), 
    0 16px 40px rgba(0, 0, 0, 0.7);
}`;

const newCtaCardBlock = `/* Full-Bleed CTA Banner - Connected Directly to Both Edges of Viewport (0px gap) */
.tk-cta-card {
  position: relative;
  width: 100vw !important;
  max-width: none !important;
  margin-left: calc(50% - 50vw) !important;
  margin-right: calc(50% - 50vw) !important;
  box-sizing: border-box !important;
  aspect-ratio: 3.7 / 1;
  min-height: 220px;
  max-height: 330px;
  border-radius: 0 !important;
  border-left: none !important;
  border-right: none !important;
  border-top: 1px solid rgba(0, 229, 255, 0.35);
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  overflow: hidden;
  background: #020308 url('/images/viewer-cta-banner-bg.png') no-repeat center / cover;
  box-shadow: 
    0 0 24px rgba(0, 229, 255, 0.16), 
    0 0 45px rgba(139, 92, 246, 0.2), 
    0 16px 40px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  isolation: isolate;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tk-cta-card:hover {
  box-shadow: 
    0 0 32px rgba(0, 229, 255, 0.28), 
    0 0 60px rgba(139, 92, 246, 0.28), 
    0 20px 48px rgba(0, 0, 0, 0.8);
}

.tk-viewer-page[data-theme="light"] .tk-cta-card {
  border-radius: 0 !important;
  border-left: none !important;
  border-right: none !important;
  border-top: 1px solid rgba(0, 229, 255, 0.35);
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  box-shadow: 
    0 0 24px rgba(0, 229, 255, 0.16), 
    0 0 45px rgba(139, 92, 246, 0.2), 
    0 16px 40px rgba(0, 0, 0, 0.7);
}`;

if (!css.includes(oldCtaCardBlock)) {
  console.error('Could not find oldCtaCardBlock in viewer-exact.css');
  process.exit(1);
}

css = css.replace(oldCtaCardBlock, newCtaCardBlock);

// 2. Update @media (max-width: 1024px)
const oldMedia1024 = `  .tk-cta-card {
    aspect-ratio: auto;
    min-height: 240px;
    padding: 32px 28px;
  }`;

const newMedia1024 = `  .tk-cta-card {
    aspect-ratio: auto;
    min-height: 240px;
    padding: 32px 28px;
    width: 100vw !important;
    max-width: none !important;
    margin-left: calc(50% - 50vw) !important;
    margin-right: calc(50% - 50vw) !important;
    border-radius: 0 !important;
    border-left: none !important;
    border-right: none !important;
  }`;

css = css.replace(oldMedia1024, newMedia1024);

// 3. Update @media (max-width: 480px)
const oldMedia480 = `  .tk-cta-card {
    min-height: 270px;
    padding: 24px 16px;
    background-position: 78% center;
  }`;

const newMedia480 = `  .tk-cta-card {
    min-height: 270px;
    padding: 24px 16px;
    background-position: 78% center;
    width: 100vw !important;
    max-width: none !important;
    margin-left: calc(50% - 50vw) !important;
    margin-right: calc(50% - 50vw) !important;
    border-radius: 0 !important;
    border-left: none !important;
    border-right: none !important;
  }`;

css = css.replace(oldMedia480, newMedia480);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated packages/ui-kit/src/styles/viewer-exact.css with full-bleed CTA rules!');
