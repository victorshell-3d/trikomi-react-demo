import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist');

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
  '.bin': 'application/octet-stream',
  '.hdr': 'image/vnd.radiance',
  '.exr': 'image/x-exr',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function startServer(port = 4175) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
        if (reqPath === '/') reqPath = '/index.html';

        let filePath = path.join(distDir, reqPath);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
          const assetSubmatch = reqPath.match(/^\/[^/]+(\/assets\/.*)$/);
          if (assetSubmatch) {
            const rootAssetPath = path.join(distDir, assetSubmatch[1]);
            if (fs.existsSync(rootAssetPath) && !fs.statSync(rootAssetPath).isDirectory()) {
              filePath = rootAssetPath;
            }
          }
        }

        if (!fs.existsSync(filePath) && reqPath.endsWith('favicon.ico')) {
          const favIco = path.join(repoRoot, 'public', 'svgs', 'favicon.svg');
          if (fs.existsSync(favIco)) filePath = favIco;
        }

        if (!fs.existsSync(filePath)) {
          const publicFallback = path.join(repoRoot, 'public', reqPath);
          if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
            filePath = publicFallback;
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
  { id: 'eyewear-tryon', name: 'Eyewear Try-On', url: '/eyewear-tryon/index.html' },
  { id: 'sportswear-configurator', name: 'Sportswear Configurator', url: '/sportswear-configurator/index.html' },
  { id: 'box-configurator', name: 'Packaging Configurator', url: '/box-configurator/index.html' },
  { id: 'face-mocap', name: 'Face Mocap', url: '/face-mocap/index.html' },
  { id: '360tour', name: '360° Virtual Tour', url: '/360tour/index.html' },
  { id: 'viewer', name: '3D Product Viewer', url: '/viewer/index.html' }
];

async function runScrollTests() {
  console.log('🚀 Starting Test Server for Scroll Verification...');
  const port = 4175;
  const server = await startServer(port);
  console.log(`🌐 Server listening at http://127.0.0.1:${port}`);

  console.log('🖥️ Launching Chrome for Scrolling Verification...');
  const tempUserDir = path.join(os.tmpdir(), `puppeteer-scroll-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
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

  const report = {
    timestamp: new Date().toISOString(),
    totalApps: APPS.length,
    results: []
  };

  try {
    for (const app of APPS) {
      console.log(`\n========================================`);
      console.log(`📜 Testing Scroll Behavior: [${app.name}]`);
      console.log(`========================================`);

      const result = {
        id: app.id,
        name: app.name,
        checks: {},
        metrics: {}
      };

      const context = await browser.createBrowserContext();
      const page = await context.newPage();

      // Catch errors
      const pageErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') pageErrors.push(msg.text());
      });

      // 1. Desktop Viewport (1440x900)
      await page.setViewport({ width: 1440, height: 900 });
      const targetUrl = `http://127.0.0.1:${port}${app.url}`;
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector('.vs-landing-hero', { timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 600));

      // Check CSS styles on html, body, #root
      const styleChecks = await page.evaluate(() => {
        const html = window.getComputedStyle(document.documentElement);
        const body = window.getComputedStyle(document.body);
        const root = document.getElementById('root') ? window.getComputedStyle(document.getElementById('root')) : null;

        return {
          htmlOverflowY: html.overflowY,
          htmlOverflowX: html.overflowX,
          bodyOverflowY: body.overflowY,
          bodyOverflowX: body.overflowX,
          rootOverflowY: root ? root.overflowY : 'auto',
          rootOverflowX: root ? root.overflowX : 'auto',
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      });

      result.metrics.desktop = styleChecks;
      result.checks.desktopCanScroll = styleChecks.scrollHeight > styleChecks.clientHeight;
      result.checks.htmlBodyNotOverflowHidden = (
        styleChecks.htmlOverflowY !== 'hidden' &&
        styleChecks.bodyOverflowY !== 'hidden' &&
        styleChecks.rootOverflowY !== 'hidden'
      );
      result.checks.desktopNoHorizontalOverflow = styleChecks.scrollWidth <= styleChecks.clientWidth;

      console.log(`  📏 Scroll Height: ${styleChecks.scrollHeight}px vs Viewport: ${styleChecks.clientHeight}px`);
      console.log(`  🔒 html.overflowY: ${styleChecks.htmlOverflowY}, body.overflowY: ${styleChecks.bodyOverflowY}, root.overflowY: ${styleChecks.rootOverflowY}`);

      // 2. Test Desktop Scrolling Down
      const scrollDownTest = await page.evaluate(async () => {
        window.scrollTo({ top: 600, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 100));
        const scrolledY = window.scrollY || document.documentElement.scrollTop;
        return scrolledY;
      });
      result.checks.desktopScrollDown = scrollDownTest > 0;
      console.log(`  ⬇️ Scrolled down: Y=${scrollDownTest}px (Expected > 0)`);

      // 3. Test Scroll to Bottom
      const scrollToBottomTest = await page.evaluate(async () => {
        const bottom = document.documentElement.scrollHeight;
        window.scrollTo({ top: bottom, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 100));
        const bottomY = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        return { bottomY, maxScroll, reachedBottom: bottomY >= maxScroll - 50 };
      });
      result.checks.desktopScrollToBottom = scrollToBottomTest.reachedBottom;
      console.log(`  ⏬ Scrolled to bottom: Y=${scrollToBottomTest.bottomY}px (Max: ${scrollToBottomTest.maxScroll}px)`);

      // 4. Test Scroll Back to Top
      const scrollToTopTest = await page.evaluate(async () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 100));
        return (window.scrollY || document.documentElement.scrollTop) === 0;
      });
      result.checks.desktopScrollBackToTop = scrollToTopTest;
      console.log(`  ⬆️ Scrolled back to top: ${scrollToTopTest}`);

      // 5. Test Mouse Wheel Scrolling Simulation
      await page.mouse.move(300, 450); // Move over left content
      await page.mouse.wheel({ deltaY: 300 });
      await new Promise(r => setTimeout(r, 200));
      const contentWheelScrollY = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);

      // Move over 3D canvas stage
      await page.mouse.move(1000, 450);
      await page.mouse.wheel({ deltaY: 300 });
      await new Promise(r => setTimeout(r, 200));
      const canvasWheelScrollY = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);

      result.checks.desktopMouseWheelScroll = canvasWheelScrollY > 0;
      console.log(`  🖱️ Mouse wheel scroll: Content Y=${contentWheelScrollY}px, Canvas Y=${canvasWheelScrollY}px`);

      // Reset to top
      await page.evaluate(() => window.scrollTo(0, 0));

      // 6. Tablet Viewport (768x1024)
      await page.setViewport({ width: 768, height: 1024 });
      await new Promise(r => setTimeout(r, 300));

      const tabletChecks = await page.evaluate(async () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;

        window.scrollTo({ top: 400, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 100));
        const scrolledY = window.scrollY || document.documentElement.scrollTop;

        window.scrollTo({ top: 0, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 100));
        const backToTop = (window.scrollY || document.documentElement.scrollTop) === 0;

        return {
          canScroll: scrollHeight > clientHeight,
          noHorizontalOverflow: scrollWidth <= clientWidth,
          scrolledY,
          backToTop
        };
      });

      result.checks.tabletCanScroll = tabletChecks.canScroll;
      result.checks.tabletScrollDown = tabletChecks.scrolledY > 0;
      result.checks.tabletScrollBackToTop = tabletChecks.backToTop;
      result.checks.tabletNoHorizontalOverflow = tabletChecks.noHorizontalOverflow;
      console.log(`  📱 Tablet: Can Scroll=${tabletChecks.canScroll}, ScrolledY=${tabletChecks.scrolledY}px, NoHorizontalOverflow=${tabletChecks.noHorizontalOverflow}`);

      // 7. Mobile Viewport (375x667)
      await page.setViewport({ width: 375, height: 667, hasTouch: true, isMobile: true });
      await new Promise(r => setTimeout(r, 300));

      const mobileChecks = await page.evaluate(async () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;

        window.scrollTo({ top: 300, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 100));
        const scrolledY = window.scrollY || document.documentElement.scrollTop;

        window.scrollTo({ top: 0, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 100));
        const backToTop = (window.scrollY || document.documentElement.scrollTop) === 0;

        return {
          canScroll: scrollHeight > clientHeight,
          noHorizontalOverflow: scrollWidth <= clientWidth,
          scrolledY,
          backToTop
        };
      });

      result.checks.mobileCanScroll = mobileChecks.canScroll;
      result.checks.mobileScrollDown = mobileChecks.scrolledY > 0;
      result.checks.mobileScrollBackToTop = mobileChecks.backToTop;
      result.checks.mobileNoHorizontalOverflow = mobileChecks.noHorizontalOverflow;
      console.log(`  📱 Mobile: Can Scroll=${mobileChecks.canScroll}, ScrolledY=${mobileChecks.scrolledY}px, NoHorizontalOverflow=${mobileChecks.noHorizontalOverflow}`);

      // 8. 3D Canvas Presence & Non-Breaking Verification
      const canvasCheck = await page.evaluate(() => {
        const canvas = document.querySelector('.vs-hero-3d-stage canvas') || document.querySelector('canvas');
        return Boolean(canvas);
      });
      result.checks.hero3DCanvasIntact = canvasCheck;
      console.log(`  🎨 3D Canvas Intact: ${canvasCheck}`);

      await page.close();
      await context.close();
      report.results.push(result);
    }

    fs.writeFileSync(
      path.join(repoRoot, 'tests', 'scroll-qa-report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log(`\n🎉 Scroll QA Completed! Report saved to tests/scroll-qa-report.json`);
  } finally {
    if (browser) await browser.close();
    server.close();
    try { fs.rmSync(tempUserDir, { recursive: true, force: true }); } catch {}
  }
}

runScrollTests().catch(err => {
  console.error('Scroll test encountered error:', err);
  process.exit(1);
});
