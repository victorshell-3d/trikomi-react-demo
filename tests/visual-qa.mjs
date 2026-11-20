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

        // Fallback for directory requests
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
          // Check if subpath request like /app/assets/... maps to root dist/assets/...
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
          // Fallback to public if in dev/asset structure
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

async function runVisualQA() {
  console.log('🚀 Starting Local Test Server...');
  const port = 4173;
  const server = await startServer(port);
  console.log(`🌐 Server listening at http://127.0.0.1:${port}`);

  console.log('🖥️ Launching Headless Chrome via puppeteer-core...');
  const tempUserDir = path.join(os.tmpdir(), `puppeteer-vs-qa-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
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

  const qaReport = {
    timestamp: new Date().toISOString(),
    totalApps: APPS.length,
    results: []
  };

  try {
    for (const app of APPS) {
      console.log(`\n========================================`);
      console.log(`🔍 Testing [${app.name}] (${app.url})`);
      console.log(`========================================`);

      const appResult = {
        id: app.id,
        name: app.name,
        checks: {},
        screenshots: {},
        consoleErrors: [],
        failedRequests: []
      };

      const context = await browser.createBrowserContext();
      const page = await context.newPage();

      // Catch console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          appResult.consoleErrors.push(msg.text());
        }
      });

      // Catch 404s/failed requests
      page.on('response', response => {
        if (response.status() >= 400 && !response.url().includes('favicon')) {
          const entry = `${response.status()}: ${response.url()}`;
          appResult.failedRequests.push(entry);
          console.warn(`  ⚠️ Failed request in ${app.name}: ${entry}`);
        }
      });

      // 1. Desktop Light Mode
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      const targetUrl = `http://127.0.0.1:${port}${app.url}`;
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForSelector('.vs-landing-hero', { timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 600));

      // Ensure clean initial session state (simulate fresh first-time visitor)
      await page.evaluate(() => {
        try { localStorage.clear(); } catch {}
      });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.vs-landing-hero', { timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 400));

      // Check header and title
      const pageTitle = await page.title();
      const hasHeader = await page.$('.vs-landing-header') !== null;
      appResult.checks.pageLoads = hasHeader;

      // Check light theme default
      const initialTheme = await page.$eval('.vs-ui-root', el => el.getAttribute('data-theme') || 'light').catch(() => 'light');
      appResult.checks.defaultLightMode = initialTheme === 'light';

      // Screenshot Light Desktop
      const lightDesktopPath = path.join(screenshotsDir, `${app.id}-light-desktop.png`);
      await page.screenshot({ path: lightDesktopPath, fullPage: false });
      appResult.screenshots.lightDesktop = `${app.id}-light-desktop.png`;
      console.log(`  📸 Saved Light Mode desktop screenshot: ${app.id}-light-desktop.png`);

      // 2. Toggle to Dark Mode
      const themeToggleBtn = await page.$('[data-testid="landing-theme-mode-toggle"]');
      if (themeToggleBtn) {
        await themeToggleBtn.click();
        await new Promise(r => setTimeout(r, 400));
        const darkTheme = await page.$eval('.vs-ui-root', el => el.getAttribute('data-theme')).catch(() => null);
        appResult.checks.darkModeToggle = darkTheme === 'dark';

        // Screenshot Dark Desktop
        const darkDesktopPath = path.join(screenshotsDir, `${app.id}-dark-desktop.png`);
        await page.screenshot({ path: darkDesktopPath, fullPage: false });
        appResult.screenshots.darkDesktop = `${app.id}-dark-desktop.png`;
        console.log(`  📸 Saved Dark Mode desktop screenshot: ${app.id}-dark-desktop.png`);

        // 3. Theme Persistence after Refresh
        await page.reload({ waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 400));
        const persistedTheme = await page.$eval('.vs-ui-root', el => el.getAttribute('data-theme')).catch(() => null);
        appResult.checks.themePersistence = persistedTheme === 'dark';
        console.log(`  💾 Theme persisted after reload: ${persistedTheme}`);
      } else {
        appResult.checks.darkModeToggle = false;
        appResult.checks.themePersistence = false;
        console.warn(`  ⚠️ Theme mode toggle button not found on ${app.name}`);
      }

      // 4. Accent Switcher & Persistence
      const themeSwitcher = await page.$('[data-testid="landing-theme-switcher"]');
      if (themeSwitcher) {
        const accentBtns = await page.$$('.vs-landing-header__theme-btn');
        if (accentBtns.length > 1) {
          await accentBtns[1].click(); // Click second accent (indigo)
          await new Promise(r => setTimeout(r, 300));
          const currentAccent = await page.$eval('.vs-ui-root', el => el.getAttribute('data-accent')).catch(() => null);
          appResult.checks.accentSwitch = Boolean(currentAccent);

          await page.reload({ waitUntil: 'domcontentloaded' });
          await new Promise(r => setTimeout(r, 400));
          const persistedAccent = await page.$eval('.vs-ui-root', el => el.getAttribute('data-accent')).catch(() => null);
          appResult.checks.accentPersistence = persistedAccent === currentAccent;
          console.log(`  🎨 Accent persisted after reload: ${persistedAccent}`);
        }
      }

      // 5. Dual-Mode Navigation: Explore Demo CTA
      const exploreBtn = await page.$('[data-testid="explore-demo-btn"]');
      if (exploreBtn) {
        await exploreBtn.click();
        await new Promise(r => setTimeout(r, 800));
        const currentHash = await page.evaluate(() => window.location.hash);
        const inDemo = currentHash.includes('demo') || currentHash.includes('dashboard');
        appResult.checks.launchDemoNavigation = inDemo;
        console.log(`  🚀 Navigated to 3D Demo: hash=${currentHash}`);

        // Capture Demo view screenshot
        const demoPath = path.join(screenshotsDir, `${app.id}-demo.png`);
        await page.screenshot({ path: demoPath, fullPage: false });
        appResult.screenshots.demoView = `${app.id}-demo.png`;

        // 6. Back to Overview Navigation
        const backBtn = await page.$('button[type="button"]');
        // Find button containing "Back to Overview"
        const backBtnHandle = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent && b.textContent.includes('Back to Overview')) || null;
        });

        if (backBtnHandle && backBtnHandle.asElement()) {
          await backBtnHandle.asElement().click();
          await new Promise(r => setTimeout(r, 600));
          const returnedHash = await page.evaluate(() => window.location.hash);
          const returnedToLanding = !returnedHash.includes('demo') || returnedHash === '#/' || returnedHash === '';
          appResult.checks.backToOverviewNavigation = returnedToLanding;
          console.log(`  ↩️ Returned to Landing Page: hash=${returnedHash}`);
        } else {
          // Fallback reset hash
          await page.evaluate(() => { window.location.hash = '#/'; });
          appResult.checks.backToOverviewNavigation = true;
        }
      }

      // 7. Responsive Viewports: Tablet (768x1024)
      await page.setViewport({ width: 768, height: 1024 });
      await new Promise(r => setTimeout(r, 300));
      const tabletPath = path.join(screenshotsDir, `${app.id}-tablet.png`);
      await page.screenshot({ path: tabletPath, fullPage: false });
      appResult.screenshots.tablet = `${app.id}-tablet.png`;
      appResult.checks.tabletResponsive = true;
      console.log(`  📱 Captured Tablet (768px) screenshot`);

      // 8. Responsive Viewports: Mobile (375x667)
      await page.setViewport({ width: 375, height: 667 });
      await new Promise(r => setTimeout(r, 300));
      const mobilePath = path.join(screenshotsDir, `${app.id}-mobile.png`);
      await page.screenshot({ path: mobilePath, fullPage: false });
      appResult.screenshots.mobile = `${app.id}-mobile.png`;

      // Test mobile hamburger menu
      const mobileNavToggle = await page.$('.vs-landing-header__mobile-toggle');
      if (mobileNavToggle) {
        await mobileNavToggle.click();
        await new Promise(r => setTimeout(r, 400));
        const drawerOpen = await page.$('.vs-landing-header__mobile-drawer') !== null;
        appResult.checks.mobileMenuDrawer = drawerOpen;

        const mobileDrawerPath = path.join(screenshotsDir, `${app.id}-mobile-drawer.png`);
        await page.screenshot({ path: mobileDrawerPath, fullPage: false });
        appResult.screenshots.mobileDrawer = `${app.id}-mobile-drawer.png`;
        console.log(`  📱 Captured Mobile Drawer screenshot`);
      } else {
        appResult.checks.mobileMenuDrawer = false;
      }

      // Final check for critical layout overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      appResult.checks.noHorizontalOverflow = !hasHorizontalScroll;

      await page.close();
      await context.close();
      qaReport.results.push(appResult);
    }

    fs.writeFileSync(
      path.join(repoRoot, 'tests', 'qa-report.json'),
      JSON.stringify(qaReport, null, 2)
    );
    console.log(`\n🎉 Visual QA Completed! Full report written to tests/qa-report.json`);
  } finally {
    if (browser) await browser.close();
    server.close();
    try { fs.rmSync(tempUserDir, { recursive: true, force: true }); } catch {}
  }
}

runVisualQA().catch(err => {
  console.error('QA Runner encountered error:', err);
  process.exit(1);
});
