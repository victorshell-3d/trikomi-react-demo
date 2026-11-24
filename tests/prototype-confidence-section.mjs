import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';
const refPath = path.join(outDir, 'ref-configure-confidence.jpg');
const knotPath = path.resolve('apps/viewer/public/images/viewer-confidence-knot.png');
const mockupPath = path.resolve('apps/viewer/public/images/viewer-confidence-mockup.png');

const refBase64 = fs.readFileSync(refPath).toString('base64');
const knotBase64 = fs.readFileSync(knotPath).toString('base64');
const mockupBase64 = fs.readFileSync(mockupPath).toString('base64');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configure with Confidence Test</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: #020308;
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      padding: 24px;
      overflow-x: hidden;
    }

    .comparison-wrap {
      max-width: 1240px;
      margin: 0 auto 40px auto;
    }

    h1 {
      font-size: 20px;
      margin-bottom: 12px;
      color: #A855F7;
    }

    .ref-container {
      margin-bottom: 30px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      overflow: hidden;
    }

    .ref-img {
      width: 100%;
      display: block;
    }

    /* -----------------------------------------------------------------------
       Recreated Section Styles (tk-confidence-section)
       ----------------------------------------------------------------------- */
    .tk-confidence-section {
      position: relative;
      width: 100%;
      background: #020308;
      overflow: hidden;
      padding: 30px 0;
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-radius: 16px;
    }

    /* Cinematic ambient neon lighting */
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      gap: 16px;
    }

    /* Column 1: Left 3D Artwork (35%) */
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
      max-height: 290px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.35)) drop-shadow(0 0 40px rgba(0, 229, 255, 0.2));
      -webkit-mask-image: linear-gradient(to right, black 82%, transparent 100%);
      mask-image: linear-gradient(to right, black 82%, transparent 100%);
      user-select: none;
      pointer-events: none;
    }

    /* Column 2: Center Content (25%) */
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
      font-size: clamp(24px, 2.4vw, 34px);
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

    /* Column 3: Right 3D Viewer Interface Preview (40%) */
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
      max-width: 450px;
      aspect-ratio: 1.38 / 1;
      height: auto;
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

    /* Left Vertical Toolbar Panel */
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

    /* Main Viewport within Mockup */
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

    /* Navigation header: back chevron & fullscreen */
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

    /* Center 3D Model Display */
    .tk-mockup-canvas-wrap {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      pointer-events: auto;
    }

    .tk-mockup-3d-img {
      max-width: 65%;
      max-height: 65%;
      object-fit: contain;
      filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5)) drop-shadow(0 0 10px rgba(0, 229, 255, 0.35));
      transition: transform 0.3s ease, filter 0.3s ease;
      cursor: grab;
    }

    .tk-mockup-3d-img:hover {
      transform: scale(1.05) rotate(3deg);
    }

    /* Bottom Material Sphere Swatches */
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
  </style>
</head>
<body>

  <div class="comparison-wrap">
    <h1>1. User Reference Screenshot:</h1>
    <div class="ref-container">
      <img src="data:image/jpeg;base64,${refBase64}" class="ref-img" alt="User Reference" />
    </div>

    <h1>2. Recreated "Configure with Confidence" Section:</h1>
    <section class="tk-confidence-section" id="confidence">
      <div class="tk-confidence-inner">
        <!-- LEFT COLUMN (35%): 3D Torus Knot + Mountains Artwork -->
        <div class="tk-confidence-left">
          <img
            src="data:image/png;base64,${knotBase64}"
            alt="Real-Time 3D Torus Rendering on Terrain"
            class="tk-confidence-artwork"
          />
        </div>

        <!-- CENTER COLUMN (25%): Badge, Heading, Description, CTA -->
        <div class="tk-confidence-center">
          <div class="tk-confidence-badge">REAL-TIME 3D EXPERIENCE</div>
          <h2 class="tk-confidence-title">
            Configure with<br />
            <span class="tk-gradient-confidence">Confidence</span>
          </h2>
          <p class="tk-confidence-desc">
            Give your customers the power to explore, personalize and experience products in stunning 3D — in real time.
          </p>
          <div class="tk-confidence-actions">
            <button type="button" class="tk-confidence-btn">
              <span>Try Live Demo</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- RIGHT COLUMN (40%): 3D Viewer Interface Preview Mockup -->
        <div class="tk-confidence-right">
          <div class="tk-mockup-frame">
            <!-- Left Toolbar -->
            <div class="tk-mockup-toolbar">
              <!-- Tool 1: Iso Box -->
              <button type="button" class="tk-mockup-tool-btn is-active" title="Isometric Model">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </button>
              <!-- Tool 2: Orbit Box -->
              <button type="button" class="tk-mockup-tool-btn" title="360° Orbit Rotation">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M21.17 8A10 10 0 0 0 3.83 8" />
                  <path d="M2.83 16a10 10 0 0 0 17.34 0" />
                </svg>
              </button>
              <!-- Tool 3: Wireframe -->
              <button type="button" class="tk-mockup-tool-btn" title="Wireframe Mesh">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
              </button>
              <!-- Tool 4: Exploded -->
              <button type="button" class="tk-mockup-tool-btn" title="Exploded Mesh Parts">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </button>
              <!-- Tool 5: Gear -->
              <button type="button" class="tk-mockup-tool-btn" title="Settings & Parameters">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>

            <!-- Viewport -->
            <div class="tk-mockup-main">
              <!-- Top Controls -->
              <div class="tk-mockup-header">
                <button type="button" class="tk-mockup-ctrl-btn" title="Back">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button type="button" class="tk-mockup-ctrl-btn" title="Fullscreen">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
              </div>

              <!-- Center 3D Model -->
              <div class="tk-mockup-canvas-wrap">
                <img
                  id="previewKnotImg"
                  src="data:image/png;base64,${knotBase64}"
                  alt="Interactive 3D Torus Knot"
                  class="tk-mockup-3d-img"
                />
              </div>

              <!-- Bottom Swatches -->
              <div class="tk-mockup-swatches">
                <button type="button" class="tk-mockup-sphere tk-sphere-silver" title="Pearl Silver Chrome"></button>
                <button type="button" class="tk-mockup-sphere tk-sphere-purple is-active" title="Metallic Violet"></button>
                <button type="button" class="tk-mockup-sphere tk-sphere-cyan" title="Electric Cyan"></button>
                <button type="button" class="tk-mockup-sphere tk-sphere-gold" title="24K Gold"></button>
                <button type="button" class="tk-mockup-sphere tk-sphere-copper" title="Rose Bronze"></button>
                <button type="button" class="tk-mockup-sphere tk-sphere-obsidian" title="Obsidian Slate"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script>
    // Swatch interactive selection
    const spheres = document.querySelectorAll('.tk-mockup-sphere');
    spheres.forEach(s => {
      s.addEventListener('click', () => {
        spheres.forEach(el => el.classList.remove('is-active'));
        s.classList.add('is-active');
      });
    });

    // Tool interactive selection
    const tools = document.querySelectorAll('.tk-mockup-tool-btn');
    tools.forEach(t => {
      t.addEventListener('click', () => {
        tools.forEach(el => el.classList.remove('is-active'));
        t.classList.add('is-active');
      });
    });
  </script>
</body>
</html>
`;

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 950, deviceScaleFactor: 2 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Screenshot side-by-side comparison
  const shotPath = path.join(outDir, 'confidence-prototype-side-by-side.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log('Saved prototype screenshot:', shotPath);

  // Also screenshot just the section
  const section = await page.$('.tk-confidence-section');
  if (section) {
    const secPath = path.join(outDir, 'confidence-prototype-section.png');
    await section.screenshot({ path: secPath });
    console.log('Saved section screenshot:', secPath);
  }

  await browser.close();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
