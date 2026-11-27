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

function startServer(port = 4182) {
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

async function runPrompt02Verification() {
  const port = 4182;
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
    // Test 1: Desktop Viewport (1440x900) & DOM Position
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // 1. Verify Category Section appears directly below Hero
    const relativePosition = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="sportswear-hero-section"]');
      const categories = document.querySelector('[data-testid="sportswear-categories-section"]');
      if (!hero || !categories) return null;
      const heroRect = hero.getBoundingClientRect();
      const catRect = categories.getBoundingClientRect();
      return {
        heroBottom: heroRect.bottom,
        catTop: catRect.top,
        isDirectlyBelow: catRect.top >= heroRect.top + heroRect.height * 0.8
      };
    });

    results.checks.push({
      test: 'Category Section Appears Directly Below Hero',
      passed: !!relativePosition && relativePosition.isDirectlyBelow,
      details: relativePosition
    });

    // 2. Verify Title and Divider
    const titleText = await page.$eval('[data-testid="sportswear-categories-title"]', el => el.innerText.trim());
    const hasDivider = await page.$eval('.tk-sw-categories-divider', el => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor.includes('255, 114, 0') || style.backgroundColor.includes('rgb(255, 114, 0)');
    });

    results.checks.push({
      test: 'Category Section Title & Orange Divider',
      passed: titleText.includes('One Studio') && titleText.includes('Multiple Sportswear Styles') && hasDivider,
      details: { titleText, hasDivider }
    });

    // 3. Verify all 5 Categories
    const categoryData = await page.$$eval('.tk-sw-category-item', items => {
      return items.map(item => ({
        name: item.querySelector('.tk-sw-category-name')?.textContent?.trim(),
        hasSvg: !!item.querySelector('.tk-sw-category-icon svg'),
        isSelected: item.getAttribute('aria-selected') === 'true'
      }));
    });

    const expectedNames = [
      'Athletic Jerseys',
      'Performance Hoodies',
      'Tracksuits',
      'Running Wear',
      'Teamwear'
    ];

    const actualNames = categoryData.map(c => c.name);
    const allNamesPresent = expectedNames.every(name => actualNames.includes(name));
    const allHaveSvg = categoryData.every(c => c.hasSvg);

    results.checks.push({
      test: 'All Five Categories Visible with Line Icons',
      passed: categoryData.length === 5 && allNamesPresent && allHaveSvg,
      details: { actualNames, allNamesPresent, count: categoryData.length }
    });

    // 4. Verify Click / Active Interaction
    // Click on 'Performance Hoodies'
    await page.click('[data-testid="sportswear-category-performance-hoodies"]');
    await new Promise(r => setTimeout(r, 200));

    const activeAfterClick = await page.$eval('[data-testid="sportswear-category-performance-hoodies"]', el => {
      return el.classList.contains('is-active') && el.getAttribute('aria-selected') === 'true';
    });

    results.checks.push({
      test: 'Category Click & Active State Interaction',
      passed: activeAfterClick,
      details: { activeAfterClick }
    });

    // Capture Desktop Dark Screenshot focusing on Hero + Category Section
    const desktopShot = 'public/qa-screenshots/prompt02-sportswear-categories-dark.png';
    await page.screenshot({ path: desktopShot, fullPage: false });
    results.screenshots.push(desktopShot);
    console.log(`📸 Saved screenshot: ${desktopShot}`);

    // -------------------------------------------------------------
    // Test 2: Theme Switching (Dark -> Light Mode)
    // -------------------------------------------------------------
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 300));

    const lightThemeMode = await page.$eval('.tk-sw-page', el => el.getAttribute('data-theme'));
    const lightStripBg = await page.$eval('.tk-sw-categories-strip', el => window.getComputedStyle(el).backgroundColor);

    results.checks.push({
      test: 'Dark and Light Themes on Categories Strip',
      passed: lightThemeMode === 'light' && (lightStripBg.includes('255, 255, 255') || lightStripBg.includes('rgba(255, 255, 255')),
      details: { lightThemeMode, lightStripBg }
    });

    const lightShot = 'public/qa-screenshots/prompt02-sportswear-categories-light.png';
    await page.screenshot({ path: lightShot, fullPage: false });
    results.screenshots.push(lightShot);
    console.log(`📸 Saved screenshot: ${lightShot}`);

    // Switch back to Dark
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 300));

    // -------------------------------------------------------------
    // Test 3: Tablet Viewport (768x1024)
    // -------------------------------------------------------------
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(r => setTimeout(r, 200));

    const tabletShot = 'public/qa-screenshots/prompt02-sportswear-categories-tablet.png';
    await page.screenshot({ path: tabletShot, fullPage: false });
    results.screenshots.push(tabletShot);
    console.log(`📸 Saved screenshot: ${tabletShot}`);

    // -------------------------------------------------------------
    // Test 4: Mobile Viewport (390x844) & Overflow Check
    // -------------------------------------------------------------
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 200));

    const mobileOverflow = await page.evaluate(() => {
      const bodyWidth = document.body.clientWidth;
      const htmlWidth = document.documentElement.clientWidth;
      const strip = document.querySelector('.tk-sw-categories-strip');
      const stripRect = strip.getBoundingClientRect();
      return {
        bodyWidth,
        htmlWidth,
        stripRight: stripRect.right,
        hasNoWindowOverflow: stripRect.right <= htmlWidth + 1
      };
    });

    results.checks.push({
      test: 'Mobile Responsiveness & No Viewport Overflow',
      passed: mobileOverflow.hasNoWindowOverflow,
      details: mobileOverflow
    });

    const mobileShot = 'public/qa-screenshots/prompt02-sportswear-categories-mobile.png';
    await page.screenshot({ path: mobileShot, fullPage: false });
    results.screenshots.push(mobileShot);
    console.log(`📸 Saved screenshot: ${mobileShot}`);

    // Scroll to categories section on mobile to inspect it
    await page.evaluate(() => {
      document.querySelector('[data-testid="sportswear-categories-section"]')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 200));

    const mobileScrolledShot = 'public/qa-screenshots/prompt02-sportswear-categories-mobile-scrolled.png';
    await page.screenshot({ path: mobileScrolledShot, fullPage: false });
    results.screenshots.push(mobileScrolledShot);
    console.log(`📸 Saved screenshot: ${mobileScrolledShot}`);

    // -------------------------------------------------------------
    // Test 5: Verify Hero Section Remains Unchanged
    // -------------------------------------------------------------
    const heroIntegrity = await page.evaluate(() => {
      const heroBadge = document.querySelector('[data-testid="sportswear-hero-badge"]')?.textContent;
      const heroTitle = document.querySelector('[data-testid="sportswear-hero-title"]')?.textContent;
      const heroProductImg = document.querySelector('[data-testid="sportswear-hero-product-img"]')?.getAttribute('src');
      return {
        badgeOk: heroBadge?.includes('INTERACTIVE 3D SPORTSWEAR PLATFORM'),
        titleOk: heroTitle?.includes('Real-Time 3D'),
        imgOk: heroProductImg?.includes('sportswear-hero-cinematic.jpg')
      };
    });

    results.checks.push({
      test: 'Hero Section Integrity Unchanged',
      passed: heroIntegrity.badgeOk && heroIntegrity.titleOk && heroIntegrity.imgOk,
      details: heroIntegrity
    });

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================ PROMPT 02 VERIFICATION RESULTS ================');
  let allPassed = true;
  for (const check of results.checks) {
    const status = check.passed ? '✅ PASS' : '❌ FAIL';
    if (!check.passed) allPassed = false;
    console.log(`${status}: ${check.test}`);
    if (check.details) console.log('   Details:', JSON.stringify(check.details));
  }
  console.log('=================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runPrompt02Verification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
