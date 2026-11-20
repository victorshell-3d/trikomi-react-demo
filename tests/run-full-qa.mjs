import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist');
const screenshotsDir = path.join(repoRoot, 'public', 'qa-screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

if (!chromePath) {
  console.error('No Chrome or Edge browser found on system.');
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.hdr': 'image/vnd.radiance',
  '.exr': 'image/x-exr',
  '.bin': 'application/octet-stream',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function startServer(port = 4173) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
        if (reqPath === '/') reqPath = '/index.html';

        let filePath = path.join(distDir, reqPath);

        // Multi-app root asset check (e.g., /assets/index-xxx.js -> /dist/<app>/assets/index-xxx.js)
        if (reqPath.startsWith('/assets/')) {
          const assetName = path.basename(reqPath);
          const appDirs = ['jewelry-configurator', 'eyewear-tryon', 'sportswear-configurator', 'box-configurator', 'face-mocap', '360tour', 'viewer'];
          for (const a of appDirs) {
            const candidate = path.join(distDir, a, 'assets', assetName);
            if (fs.existsSync(candidate) && !fs.statSync(candidate).isDirectory()) {
              filePath = candidate;
              break;
            }
          }
        }

        // Subpath asset check (e.g., /viewer/assets/ -> /dist/viewer/assets/)
        const appAssetMatch = reqPath.match(/^\/([^/]+)(\/assets\/.*)$/);
        if (appAssetMatch) {
          const directAppAsset = path.join(distDir, appAssetMatch[1], appAssetMatch[2]);
          if (fs.existsSync(directAppAsset) && !fs.statSync(directAppAsset).isDirectory()) {
            filePath = directAppAsset;
          }
        }

        // Fallback for directory requests
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        // Fallback to public folder
        if (!fs.existsSync(filePath)) {
          const publicFallback = path.join(repoRoot, 'public', reqPath);
          if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
            filePath = publicFallback;
          } else if (reqPath.endsWith('favicon.ico')) {
            const favIco = path.join(repoRoot, 'public', 'svgs', 'favicon.svg');
            if (fs.existsSync(favIco)) filePath = favIco;
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`File not found: ${reqPath}`);
            return;
          }
        }

        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Length': stat.size,
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Internal Error: ${err.message}`);
      }
    });

    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
    server.on('error', reject);
  });
}

const APPS = [
  { id: 'jewelry-configurator', name: 'Jewelry Configurator', url: '/jewelry-configurator/index.html' },
  { id: 'eyewear-tryon', name: 'Eyewear Virtual Try-On', url: '/eyewear-tryon/index.html' },
  { id: 'sportswear-configurator', name: 'Sportswear Configurator', url: '/sportswear-configurator/index.html' },
  { id: 'box-configurator', name: 'Box / Packaging Configurator', url: '/box-configurator/index.html' },
  { id: 'face-mocap', name: 'Face Motion Capture', url: '/face-mocap/index.html' },
  { id: '360tour', name: '360° Virtual Tour', url: '/360tour/index.html' },
  { id: 'viewer', name: '3D Product Viewer', url: '/viewer/index.html' }
];

const VIEWPORTS = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 }
];

async function runComprehensiveQA() {
  console.log('🚀 Starting Local Test Server for Full QA Suite...');
  const port = 4174;
  const server = await startServer(port);
  console.log(`🌐 Server listening at http://127.0.0.1:${port}`);

  const tempUserDir = path.join(os.tmpdir(), `puppeteer-full-qa-${Date.now()}`);
  fs.mkdirSync(tempUserDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    userDataDir: tempUserDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--use-gl=angle',
      '--use-angle=swiftshader'
    ]
  });

  const fullReport = {
    testDate: new Date().toISOString(),
    totalApps: APPS.length,
    results: []
  };

  try {
    for (const app of APPS) {
      console.log(`\n======================================================`);
      console.log(`🧪 Testing Application: ${app.name} (${app.id})`);
      console.log(`======================================================`);

      const appData = {
        id: app.id,
        name: app.name,
        status: 'PASS',
        uiVisualChecks: {},
        functionalChecks: {},
        responsiveChecks: {},
        technicalChecks: {
          consoleErrors: [],
          failedRequests: [],
          loadTimeMs: 0
        },
        screenshots: {}
      };

      const context = await browser.createBrowserContext();
      const page = await context.newPage();

      // Listen to console and network
      page.on('console', msg => {
        if (msg.type() === 'error') {
          appData.technicalChecks.consoleErrors.push(msg.text());
        }
      });

      page.on('response', resp => {
        if (resp.status() >= 400 && !resp.url().includes('favicon')) {
          appData.technicalChecks.failedRequests.push(`${resp.status()}: ${resp.url()}`);
        }
      });

      // 1. Initial Page Load & Performance Measurement
      const startTime = Date.now();
      await page.setViewport({ width: 1920, height: 1080 });
      const targetUrl = `http://127.0.0.1:${port}${app.url}`;
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      appData.technicalChecks.loadTimeMs = Date.now() - startTime;
      console.log(`  ⏱️ Loaded in ${appData.technicalChecks.loadTimeMs}ms`);

      // Clear local storage to simulate clean initial state
      await page.evaluate(() => { try { localStorage.clear(); } catch {} });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 600));

      // 2. UI & Visual Checks
      const hasHeader = await page.$('.vs-landing-header') !== null;
      const hasHero = await page.$('.vs-landing-hero') !== null;
      const hasFeatures = await page.$('.vs-landing-features') !== null;
      const hasShowcase = await page.$('#showcase') !== null;
      const hasBenefits = await page.$('#benefits') !== null;
      const hasFooter = await page.$('footer.vs-landing-footer') !== null;

      appData.uiVisualChecks.headerNavbarPresent = hasHeader;
      appData.uiVisualChecks.heroSectionPresent = hasHero;
      appData.uiVisualChecks.featuresGridPresent = hasFeatures;
      appData.uiVisualChecks.showcasePresent = hasShowcase;
      appData.uiVisualChecks.benefitsPresent = hasBenefits;
      appData.uiVisualChecks.footerPresent = hasFooter;

      // Color Palette Verification (Pearl White / Lavender theme)
      const themeColors = await page.evaluate(() => {
        const root = document.querySelector('.vs-ui-root') || document.documentElement;
        const style = getComputedStyle(root);
        return {
          primary: style.getPropertyValue('--vs-primary').trim(),
          bg: style.getPropertyValue('--vs-bg-base').trim() || style.getPropertyValue('--vs-bg-page').trim(),
          fontDisplay: style.getPropertyValue('--vs-font-display').trim()
        };
      });
      appData.uiVisualChecks.themeColors = themeColors;
      appData.uiVisualChecks.paletteCompliant = Boolean(themeColors.primary);

      // Specifically check for missing images or empty grey sections in showcase
      if (hasShowcase) {
        const showcaseCheck = await page.evaluate(() => {
          const sc = document.querySelector('#showcase');
          if (!sc) return { found: false };
          const imgs = Array.from(sc.querySelectorAll('img'));
          const visibleImgs = imgs.filter(img => img.naturalWidth > 0 || img.complete);
          const hasVisualWrapper = Boolean(sc.querySelector('.vs-landing-showcase__visual-wrapper'));
          const visualCard = sc.querySelector('[class*="-preview-card"]');
          return {
            found: true,
            hasVisualCard: Boolean(visualCard),
            imgCount: imgs.length,
            visibleImgs: visibleImgs.length,
            hasVisualWrapper
          };
        });
        appData.uiVisualChecks.showcaseImageCheck = showcaseCheck;
        console.log(`  🖼️ Showcase visual check:`, showcaseCheck);
      }

      // Check Feature Cards Grid Dimensions (prompt 03 standardization)
      if (hasFeatures) {
        const featuresGridCheck = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll('.vs-feature-card'));
          if (cards.length === 0) return null;
          const rects = cards.map(c => c.getBoundingClientRect());
          return {
            count: cards.length,
            widths: rects.map(r => Math.round(r.width))
          };
        });
        appData.uiVisualChecks.featuresGrid = featuresGridCheck;
      }

      // 3. Functional Checks
      // Theme Toggle (Light -> Dark -> Light)
      try {
        const themeToggle = await page.$('[data-testid="landing-theme-mode-toggle"]');
        if (themeToggle) {
          await themeToggle.click();
          await new Promise(r => setTimeout(r, 300));
          const darkTheme = await page.evaluate(() => document.querySelector('.vs-ui-root')?.getAttribute('data-theme'));
          appData.functionalChecks.darkModeSwitch = darkTheme === 'dark';

          // Switch back to light safely
          const toggleBack = await page.$('[data-testid="landing-theme-mode-toggle"]');
          if (toggleBack) await toggleBack.click();
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (err) {
        console.warn(`  ⚠️ Theme toggle handled for ${app.name}: ${err.message}`);
      }

      // Navigation links check
      const navLinks = await page.$$eval('.vs-landing-header__nav-link', els => els.map(el => el.getAttribute('href')));
      appData.functionalChecks.navLinks = navLinks;

      // Try Live Demo navigation check
      const demoBtn = await page.$('[data-testid="explore-demo-btn"]');
      if (demoBtn) {
        await demoBtn.click();
        await new Promise(r => setTimeout(r, 600));
        const currentHash = await page.evaluate(() => window.location.hash);
        const demoOpened = currentHash.includes('demo') || currentHash.includes('dashboard');
        appData.functionalChecks.launchDemo = demoOpened;

        // Back to Overview
        await page.evaluate(() => { window.location.hash = '#/'; });
        await new Promise(r => setTimeout(r, 400));
      }

      // 4. Responsive Checks across 1920, 1366, 768, 390
      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await new Promise(r => setTimeout(r, 300));

        const overflowCheck = await page.evaluate(() => {
          const docEl = document.documentElement;
          const bodyEl = document.body;
          return {
            scrollWidth: Math.max(docEl.scrollWidth, bodyEl.scrollWidth),
            clientWidth: docEl.clientWidth,
            hasHorizontalScroll: Math.max(docEl.scrollWidth, bodyEl.scrollWidth) > docEl.clientWidth + 1
          };
        });

        appData.responsiveChecks[vp.name] = {
          viewport: `${vp.width}x${vp.height}`,
          hasHorizontalScroll: overflowCheck.hasHorizontalScroll,
          scrollWidth: overflowCheck.scrollWidth,
          clientWidth: overflowCheck.clientWidth
        };

        // Screenshot for 1920 desktop and 390 mobile
        if (vp.name === 'desktop-1920') {
          const ssPath = path.join(screenshotsDir, `${app.id}-1920.png`);
          await page.screenshot({ path: ssPath, fullPage: false });
          appData.screenshots.desktop1920 = `${app.id}-1920.png`;
        } else if (vp.name === 'mobile-390') {
          const ssPath = path.join(screenshotsDir, `${app.id}-mobile-390.png`);
          await page.screenshot({ path: ssPath, fullPage: false });
          appData.screenshots.mobile390 = `${app.id}-mobile-390.png`;
        }
      }

      // Determine PASS / FAIL
      const hasCriticalError = appData.technicalChecks.consoleErrors.some(err => 
        !err.includes('favicon') && 
        !err.includes('THREE.WebGLRenderer') &&
        !err.includes('getUserMedia') &&
        !err.includes('Permission denied') &&
        !err.includes('NotFoundError: Requested device not found')
      );
      const hasFailedAssets = appData.technicalChecks.failedRequests.some(r => !r.includes('favicon'));
      const hasOverflow = Object.values(appData.responsiveChecks).some(rc => rc.hasHorizontalScroll);

      if (hasCriticalError || hasFailedAssets || hasOverflow) {
        appData.status = 'FAIL';
        console.log(`  ❌ FAIL Details for ${app.name}:`, {
          hasCriticalError,
          consoleErrors: appData.technicalChecks.consoleErrors,
          hasFailedAssets,
          failedRequests: appData.technicalChecks.failedRequests,
          hasOverflow,
          overflowViewports: Object.entries(appData.responsiveChecks).filter(([_, v]) => v.hasHorizontalScroll)
        });
      } else {
        appData.status = 'PASS';
      }

      console.log(`  🏁 Result for ${app.name}: ${appData.status}`);
      await page.close();
      await context.close();
      fullReport.results.push(appData);
    }

    fs.writeFileSync(
      path.join(repoRoot, 'tests', 'qa-results-automated.json'),
      JSON.stringify(fullReport, null, 2)
    );
    console.log(`\n✅ QA Testing Finished! Output saved to tests/qa-results-automated.json`);
  } finally {
    if (browser) await browser.close();
    server.close();
    try { fs.rmSync(tempUserDir, { recursive: true, force: true }); } catch {}
  }
}

runComprehensiveQA().catch(err => {
  console.error('QA Runner error:', err);
  process.exit(1);
});
