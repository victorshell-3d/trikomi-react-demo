import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist', 'sportswear-configurator');
const screenshotsDir = path.join(repoRoot, 'public', 'qa-screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

if (!chromePath) {
  console.error('No Chrome or Edge browser found.');
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
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm'
};

function startServer(port = 4180) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
        if (reqPath === '/' || reqPath === '/sportswear-configurator/') reqPath = '/index.html';
        if (reqPath.startsWith('/sportswear-configurator/')) {
          reqPath = reqPath.replace('/sportswear-configurator/', '/');
        }

        let filePath = path.join(distDir, reqPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
          const publicFallback = path.join(repoRoot, 'public', reqPath);
          if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
            filePath = publicFallback;
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not found: ${reqPath}`);
            return;
          }
        }

        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Content-Length': stat.size,
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } catch (e) {
        res.writeHead(500);
        res.end(e.message);
      }
    });

    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

async function runVerification() {
  const port = 4180;
  const server = await startServer(port);
  console.log(`🚀 Static server running on http://127.0.0.1:${port}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  const results = {
    checks: [],
    screenshots: []
  };

  try {
    // -------------------------------------------------------------
    // Test 1: Desktop Viewport (1440x900)
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Check navbar
    const navbar = await page.$('[data-testid="sportswear-navbar"]');
    const brand = await page.$('.tk-sw-brand');
    const brandName = await page.$eval('.tk-sw-brand__name', el => el.textContent.trim());
    const launchStudioBtn = await page.$('[data-testid="navbar-launch-studio-btn"]');
    const searchBtn = await page.$('[data-testid="navbar-search-btn"]');
    const themeToggle = await page.$('[data-testid="sportswear-theme-toggle"]');

    results.checks.push({
      test: 'Navbar Components',
      passed: !!navbar && !!brand && brandName === 'Trikomi' && !!launchStudioBtn && !!searchBtn && !!themeToggle,
      details: { brandName, hasNavbar: !!navbar, hasLaunchBtn: !!launchStudioBtn, hasSearchBtn: !!searchBtn }
    });

    // Check Hero elements
    const badgeText = await page.$eval('[data-testid="sportswear-hero-badge"]', el => el.textContent.trim());
    const titleText = await page.$eval('[data-testid="sportswear-hero-title"]', el => el.textContent.trim());
    const highlightText = await page.$eval('.tk-sw-hero__highlight', el => el.textContent.trim());
    const descText = await page.$eval('[data-testid="sportswear-hero-desc"]', el => el.textContent.trim());
    const heroLaunchBtn = await page.$('[data-testid="hero-launch-studio-btn"]');
    const exploreCapBtn = await page.$('[data-testid="hero-explore-capabilities-btn"]');
    const indicators = await page.$$eval('.tk-sw-indicator', els => els.map(e => e.textContent.trim()));
    const productImg = await page.$eval('[data-testid="sportswear-hero-product-img"]', el => ({
      src: el.src,
      complete: el.complete,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight
    }));

    results.checks.push({
      test: 'Hero Badge Content',
      passed: badgeText.includes('INTERACTIVE 3D SPORTSWEAR PLATFORM'),
      badgeText
    });

    results.checks.push({
      test: 'Hero Title & Highlight',
      passed: titleText.includes('Design, Customize & Experience Sportswear') && highlightText === 'Real-Time 3D',
      titleText,
      highlightText
    });

    results.checks.push({
      test: 'Hero Description',
      passed: descText.includes('Create, customize and visualize sportswear products with high-quality 3D previews'),
      descText
    });

    results.checks.push({
      test: 'Hero Buttons & Indicators',
      passed: !!heroLaunchBtn && !!exploreCapBtn && indicators.length === 3 && indicators.includes('Real-Time 3D') && indicators.includes('Material Customization') && indicators.includes('Live Preview'),
      indicators
    });

    results.checks.push({
      test: 'Hero 3D Product Visual Image',
      passed: productImg.complete && productImg.naturalWidth > 0 && productImg.naturalHeight > 0,
      productImg
    });

    // Take Desktop Dark Mode Screenshot
    const desktopShot = 'public/qa-screenshots/prompt01-sportswear-desktop-dark.png';
    await page.screenshot({ path: desktopShot, fullPage: false });
    results.screenshots.push(desktopShot);
    console.log(`📸 Saved screenshot: ${desktopShot}`);

    // -------------------------------------------------------------
    // Test 2: Theme Switching (Dark -> Light -> Dark)
    // -------------------------------------------------------------
    const initialTheme = await page.$eval('.tk-sw-page', el => el.getAttribute('data-theme'));
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 300));
    const lightTheme = await page.$eval('.tk-sw-page', el => el.getAttribute('data-theme'));

    const lightShot = 'public/qa-screenshots/prompt01-sportswear-desktop-light.png';
    await page.screenshot({ path: lightShot, fullPage: false });
    results.screenshots.push(lightShot);
    console.log(`📸 Saved screenshot: ${lightShot}`);

    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 300));
    const backToDark = await page.$eval('.tk-sw-page', el => el.getAttribute('data-theme'));

    results.checks.push({
      test: 'Theme Toggle Functionality',
      passed: initialTheme === 'dark' && lightTheme === 'light' && backToDark === 'dark',
      details: { initialTheme, lightTheme, backToDark }
    });

    // -------------------------------------------------------------
    // Test 3: Tablet Viewport (768x1024)
    // -------------------------------------------------------------
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(r => setTimeout(r, 200));
    const tabletShot = 'public/qa-screenshots/prompt01-sportswear-tablet.png';
    await page.screenshot({ path: tabletShot, fullPage: false });
    results.screenshots.push(tabletShot);
    console.log(`📸 Saved screenshot: ${tabletShot}`);

    // -------------------------------------------------------------
    // Test 4: Mobile Viewport (390x844)
    // -------------------------------------------------------------
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 200));

    // Verify mobile hamburger is visible
    const mobileToggle = await page.$eval('[data-testid="navbar-mobile-toggle"]', el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none';
    });

    const mobileShot = 'public/qa-screenshots/prompt01-sportswear-mobile.png';
    await page.screenshot({ path: mobileShot, fullPage: false });
    results.screenshots.push(mobileShot);
    console.log(`📸 Saved screenshot: ${mobileShot}`);

    results.checks.push({
      test: 'Mobile Responsiveness & Stacking',
      passed: mobileToggle,
      details: { mobileToggleVisible: mobileToggle }
    });

    // -------------------------------------------------------------
    // Test 5: Launch 3D Studio routing to Configurator and back
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.click('[data-testid="hero-launch-studio-btn"]');
    await new Promise(r => setTimeout(r, 600));

    const currentHash = await page.evaluate(() => window.location.hash);
    const studioStage = await page.$('.luxury-studio-stage');
    const studioShot = 'public/qa-screenshots/prompt01-sportswear-studio-opened.png';
    await page.screenshot({ path: studioShot, fullPage: false });
    results.screenshots.push(studioShot);
    console.log(`📸 Saved screenshot: ${studioShot}`);

    results.checks.push({
      test: 'Launch 3D Studio Opens Configurator',
      passed: currentHash === '#demo' && !!studioStage,
      details: { currentHash, studioStagePresent: !!studioStage }
    });

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================ VERIFICATION RESULTS ================');
  let allPassed = true;
  for (const check of results.checks) {
    const status = check.passed ? '✅ PASS' : '❌ FAIL';
    if (!check.passed) allPassed = false;
    console.log(`${status}: ${check.test}`);
    if (check.details) console.log('   Details:', JSON.stringify(check.details));
  }
  console.log('======================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
