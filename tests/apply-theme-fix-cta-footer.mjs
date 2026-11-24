import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve('packages/ui-kit/src/styles/viewer-exact.css');
let css = fs.readFileSync(cssPath, 'utf8');

const targetOld = `/* --------------------------------------------------------------------------
   7. Integrated Bottom Area: CTA Banner + Compact Footer
   -------------------------------------------------------------------------- */
.tk-bottom-integrated {
  position: relative;
  background: #020308 !important;
  padding: 36px 0 20px 0;
  z-index: 2;
  overflow: hidden;
}

.tk-viewer-page[data-theme="light"] .tk-bottom-integrated {
  background: #020308 !important;
}

/* Full-Bleed CTA Banner - Connected Directly to Both Edges of Viewport (0px gap) */
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
}

/* Left Content Area (approx 42% width, exactly 7.5% from left card edge) */
.tk-cta-content {
  position: relative;
  z-index: 3;
  padding-left: 7.5%;
  width: 44%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  justify-content: center;
}

.tk-cta-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #C084FC !important;
  text-transform: uppercase;
  margin-bottom: 7px;
}

.tk-viewer-page[data-theme="light"] .tk-cta-label {
  color: #C084FC !important;
}

.tk-cta-title {
  font-size: clamp(19px, 2.25vw, 29px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0 0 16px 0;
  color: #FFFFFF !important;
}

.tk-cta-actions {
  display: flex;
  align-items: center;
}

/* Symmetrical Angular CTA Button ("Book a Demo →") matching PROMPT 21 */
.tk-cta-btn-demo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 24px;
  background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%) !important;
  color: #FFFFFF !important;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border-radius: 0 !important;
  clip-path: polygon(
    14px 0%,
    100% 0%,
    calc(100% - 14px) 100%,
    0% 100%
  ) !important;
  border: none !important;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 0 18px rgba(124, 58, 237, 0.6), 0 0 10px rgba(37, 99, 235, 0.4), inset 1px 1px 0 rgba(255, 255, 255, 0.35);
  filter: drop-shadow(0 0 16px rgba(124, 58, 237, 0.75)) drop-shadow(0 0 10px rgba(37, 99, 235, 0.5));
}

.tk-cta-btn-demo:hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 0 24px rgba(124, 58, 237, 0.95)) drop-shadow(0 0 16px rgba(37, 99, 235, 0.8));
  background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%) !important;
}

/* --------------------------------------------------------------------------
   8. Compact Integrated Footer
   -------------------------------------------------------------------------- */
.tk-footer {
  border-top: none;
  padding: 16px 0 4px 0;
  background: transparent !important;
  transition: all 0.25s ease;
}

.tk-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.tk-footer__left {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.tk-footer__left .tk-brand__name {
  color: #FFFFFF !important;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.tk-footer__left .tk-brand__icon {
  color: #FFFFFF !important;
}

.tk-footer__copy {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.55) !important;
}

.tk-viewer-page[data-theme="light"] .tk-footer__copy {
  color: rgba(255, 255, 255, 0.55) !important;
}

.tk-footer__right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.tk-footer__links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.tk-footer__divider {
  color: rgba(255, 255, 255, 0.25) !important;
  font-size: 13px;
  font-weight: 300;
  user-select: none;
}

.tk-viewer-page[data-theme="light"] .tk-footer__divider {
  color: rgba(255, 255, 255, 0.25) !important;
}

.tk-footer__link {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.72) !important;
  text-decoration: none;
  transition: color 0.2s ease;
}

.tk-footer__link:hover {
  color: #00E5FF !important;
}

.tk-viewer-page[data-theme="light"] .tk-footer__link {
  color: rgba(255, 255, 255, 0.72) !important;
}

.tk-viewer-page[data-theme="light"] .tk-footer__link:hover {
  color: #00E5FF !important;
}

.tk-footer__socials {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tk-social-btn {
  color: rgba(255, 255, 255, 0.72) !important;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
}

.tk-social-btn:hover {
  color: #00E5FF !important;
  transform: translateY(-1px);
}

.tk-viewer-page[data-theme="light"] .tk-social-btn {
  color: rgba(255, 255, 255, 0.72) !important;
}

.tk-viewer-page[data-theme="light"] .tk-social-btn:hover {
  color: #00E5FF !important;
}`;

const targetNew = `/* --------------------------------------------------------------------------
   7. Integrated Bottom Area: CTA Banner + Compact Footer (PROMPT 30 Theme Support)
   -------------------------------------------------------------------------- */
.tk-bottom-integrated {
  position: relative;
  background: #020308;
  padding: 36px 0 20px 0;
  z-index: 2;
  overflow: hidden;
  transition: background 0.3s ease;
}

.tk-viewer-page[data-theme="light"] .tk-bottom-integrated {
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%) !important;
}

/* Full-Bleed CTA Banner - Connected Directly to Both Edges of Viewport (0px gap) */
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
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
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
  border-top: 1px solid rgba(139, 92, 246, 0.35) !important;
  border-bottom: 1px solid rgba(14, 165, 233, 0.25) !important;
  background: 
    linear-gradient(90deg, rgba(248, 250, 252, 0.96) 0%, rgba(243, 240, 255, 0.90) 38%, rgba(248, 250, 252, 0.35) 70%, rgba(248, 250, 252, 0.05) 100%),
    url('/images/viewer-cta-banner-bg.png') no-repeat center / cover !important;
  box-shadow: 
    0 10px 30px rgba(139, 92, 246, 0.12), 
    0 0 24px rgba(14, 165, 233, 0.08), 
    0 16px 40px rgba(0, 0, 0, 0.06) !important;
}

/* Left Content Area (approx 42% width, exactly 7.5% from left card edge) */
.tk-cta-content {
  position: relative;
  z-index: 3;
  padding-left: 7.5%;
  width: 44%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  justify-content: center;
}

.tk-cta-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #C084FC !important;
  text-transform: uppercase;
  margin-bottom: 7px;
  transition: color 0.2s ease;
}

.tk-viewer-page[data-theme="light"] .tk-cta-label {
  color: #7C3AED !important;
}

.tk-cta-title {
  font-size: clamp(19px, 2.25vw, 29px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0 0 16px 0;
  color: #FFFFFF !important;
  transition: color 0.2s ease;
}

.tk-viewer-page[data-theme="light"] .tk-cta-title {
  color: #0F172A !important;
}

.tk-cta-actions {
  display: flex;
  align-items: center;
}

/* Symmetrical Angular CTA Button ("Book a Demo →") matching PROMPT 21 */
.tk-cta-btn-demo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 24px;
  background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%) !important;
  color: #FFFFFF !important;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border-radius: 0 !important;
  clip-path: polygon(
    14px 0%,
    100% 0%,
    calc(100% - 14px) 100%,
    0% 100%
  ) !important;
  border: none !important;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 0 18px rgba(124, 58, 237, 0.6), 0 0 10px rgba(37, 99, 235, 0.4), inset 1px 1px 0 rgba(255, 255, 255, 0.35);
  filter: drop-shadow(0 0 16px rgba(124, 58, 237, 0.75)) drop-shadow(0 0 10px rgba(37, 99, 235, 0.5));
}

.tk-cta-btn-demo:hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 0 24px rgba(124, 58, 237, 0.95)) drop-shadow(0 0 16px rgba(37, 99, 235, 0.8));
  background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%) !important;
}

.tk-viewer-page[data-theme="light"] .tk-cta-btn-demo {
  background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%) !important;
  color: #FFFFFF !important;
  box-shadow: 0 4px 18px rgba(124, 58, 237, 0.45), 0 0 10px rgba(37, 99, 235, 0.3) !important;
  filter: drop-shadow(0 4px 14px rgba(124, 58, 237, 0.45)) !important;
}

.tk-viewer-page[data-theme="light"] .tk-cta-btn-demo:hover {
  background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%) !important;
  filter: drop-shadow(0 6px 20px rgba(124, 58, 237, 0.65)) !important;
}

/* --------------------------------------------------------------------------
   8. Compact Integrated Footer (PROMPT 30 Theme Support)
   -------------------------------------------------------------------------- */
.tk-footer {
  border-top: none;
  padding: 16px 0 4px 0;
  background: transparent !important;
  transition: all 0.25s ease;
}

.tk-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.tk-footer__left {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.tk-footer__left .tk-brand__name {
  color: #FFFFFF;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: color 0.2s ease;
}

.tk-footer__left .tk-brand__icon {
  color: #FFFFFF;
  transition: color 0.2s ease;
}

.tk-viewer-page[data-theme="light"] .tk-footer__left .tk-brand__name {
  color: #0F172A !important;
}

.tk-viewer-page[data-theme="light"] .tk-footer__left .tk-brand__icon {
  color: #7C3AED !important;
}

.tk-footer__copy {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.2s ease;
}

.tk-viewer-page[data-theme="light"] .tk-footer__copy {
  color: #64748B !important;
}

.tk-footer__right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.tk-footer__links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.tk-footer__divider {
  color: rgba(255, 255, 255, 0.25);
  font-size: 13px;
  font-weight: 300;
  user-select: none;
  transition: color 0.2s ease;
}

.tk-viewer-page[data-theme="light"] .tk-footer__divider {
  color: #CBD5E1 !important;
}

.tk-footer__link {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  transition: color 0.2s ease;
}

.tk-footer__link:hover {
  color: #00E5FF;
}

.tk-viewer-page[data-theme="light"] .tk-footer__link {
  color: #334155 !important;
}

.tk-viewer-page[data-theme="light"] .tk-footer__link:hover {
  color: #7C3AED !important;
}

.tk-footer__socials {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tk-social-btn {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
}

.tk-social-btn:hover {
  color: #00E5FF;
  transform: translateY(-1px);
}

.tk-viewer-page[data-theme="light"] .tk-social-btn {
  color: #475569 !important;
}

.tk-viewer-page[data-theme="light"] .tk-social-btn:hover {
  color: #7C3AED !important;
  transform: translateY(-1px);
}`;

if (!css.includes(targetOld)) {
  console.error('Could not find targetOld block in viewer-exact.css');
  process.exit(1);
}

css = css.replace(targetOld, targetNew);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated viewer-exact.css with Prompt 30 Light/Dark theme styles for CTA & Footer!');
