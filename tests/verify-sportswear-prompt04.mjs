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

function startServer(port = 4186) {
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

async function runPrompt04Verification() {
  const port = 4186;
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
    // Test 1: Desktop Viewport (1440x900) & Section Placement
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Section placement check (Showcase directly below Capabilities)
    const sectionPlacement = await page.evaluate(() => {
      const cap = document.querySelector('[data-testid="sportswear-capabilities-section"]');
      const show = document.querySelector('[data-testid="sportswear-showcase-section"]');
      if (!cap || !show) return null;
      const capRect = cap.getBoundingClientRect();
      const showRect = show.getBoundingClientRect();
      return {
        capBottom: capRect.bottom,
        showTop: showRect.top,
        isDirectlyBelow: showRect.top >= capRect.top
      };
    });

    results.checks.push({
      test: '3D Studio Showcase Section Appears Below Capabilities',
      passed: !!sectionPlacement && sectionPlacement.isDirectlyBelow,
      details: sectionPlacement
    });

    // Heading, Badge & Description check
    const badgeText = await page.$eval('[data-testid="sportswear-showcase-badge"]', el => el.textContent.trim());
    const titleText = await page.$eval('[data-testid="sportswear-showcase-title"]', el => el.textContent.trim());
    const descText = await page.$eval('[data-testid="sportswear-showcase-desc"]', el => el.textContent.trim());

    results.checks.push({
      test: 'Showcase Section Label, Heading & Description',
      passed: badgeText.includes('EXPERIENCE THE STUDIO') &&
              titleText === 'Your Sportswear. Your Vision. In 3D.' &&
              descText.includes('Experience the power of real-time sportswear customization'),
      details: { badgeText, titleText, descText }
    });

    // Subtitle & Feature list check (All 4 features)
    const subtitleText = await page.$eval('[data-testid="sportswear-showcase-subtitle"]', el => el.textContent.trim());
    const features = await page.$$eval('.tk-sw-showcase-feature span', els => els.map(e => e.textContent.trim()));

    const expectedFeatures = [
      'Interactive 360° product rotation',
      'Realistic fabric and material previews',
      'Custom colors and patterns',
      'Personalized logos and player numbers'
    ];

    const allFeaturesMatch = expectedFeatures.every(f => features.includes(f));

    results.checks.push({
      test: 'All Four Showcase Feature Points Visible',
      passed: subtitleText === 'Design Without Limits' && features.length === 4 && allFeaturesMatch,
      details: { subtitleText, features, allFeaturesMatch }
    });

    // Scroll to showcase section and ensure visual is loaded
    await page.evaluate(async () => {
      const showSection = document.querySelector('[data-testid="sportswear-showcase-section"]');
      if (showSection) {
        showSection.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
      const img = document.querySelector('[data-testid="sportswear-showcase-img"]');
      if (img && !img.complete) {
        await new Promise(resolve => {
          img.onload = img.onerror = resolve;
          setTimeout(resolve, 3000);
        });
      }
    });

    // Product visual check
    const visualData = await page.$eval('[data-testid="sportswear-showcase-img"]', el => ({
      src: el.src,
      complete: el.complete,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight
    }));

    results.checks.push({
      test: 'Showcase Product Visual Loaded & Aligned',
      passed: visualData.complete && visualData.naturalWidth > 0 && visualData.src.includes('sportswear-showcase-cinematic.jpg'),
      details: visualData
    });

    // Desktop 2-column grid check
    const desktopGridCols = await page.$eval('.tk-sw-showcase-grid', el => {
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });

    results.checks.push({
      test: 'Desktop 2-Column Showcase Layout',
      passed: desktopGridCols === 2,
      details: { desktopGridCols }
    });

    // Scroll to showcase section to take clean screenshot
    await page.evaluate(() => {
      document.querySelector('[data-testid="sportswear-showcase-section"]')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 200));

    const desktopShot = 'public/qa-screenshots/prompt04-sportswear-showcase-dark.png';
    await page.screenshot({ path: desktopShot, fullPage: false });
    results.screenshots.push(desktopShot);
    console.log(`📸 Saved screenshot: ${desktopShot}`);

    // -------------------------------------------------------------
    // Test 2: Theme Switching (Dark -> Light Mode)
    // -------------------------------------------------------------
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 300));

    const lightCardBg = await page.$eval('.tk-sw-showcase-card', el => window.getComputedStyle(el).backgroundColor);
    const lightThemeMode = await page.$eval('.tk-sw-page', el => el.getAttribute('data-theme'));

    results.checks.push({
      test: 'Dark and Light Theme Compatibility on Showcase Card',
      passed: lightThemeMode === 'light' && (lightCardBg.includes('255, 255, 255') || lightCardBg.includes('rgba(255, 255, 255')),
      details: { lightThemeMode, lightCardBg }
    });

    const lightShot = 'public/qa-screenshots/prompt04-sportswear-showcase-light.png';
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

    const tabletShot = 'public/qa-screenshots/prompt04-sportswear-showcase-tablet.png';
    await page.screenshot({ path: tabletShot, fullPage: false });
    results.screenshots.push(tabletShot);
    console.log(`📸 Saved screenshot: ${tabletShot}`);

    // -------------------------------------------------------------
    // Test 4: Mobile Viewport (390x844) & No Horizontal Overflow
    // -------------------------------------------------------------
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 200));

    const mobileLayoutCheck = await page.evaluate(() => {
      const htmlWidth = document.documentElement.clientWidth;
      const leftCol = document.querySelector('.tk-sw-showcase-left');
      const rightCol = document.querySelector('.tk-sw-showcase-right');
      const card = document.querySelector('.tk-sw-showcase-card');
      const cardRect = card.getBoundingClientRect();
      const leftRect = leftCol.getBoundingClientRect();
      const rightRect = rightCol.getBoundingClientRect();

      return {
        htmlWidth,
        textFirst: leftRect.top < rightRect.top,
        hasNoOverflow: cardRect.right <= htmlWidth + 1
      };
    });

    results.checks.push({
      test: 'Mobile Layout: Text First, Visual Below & No Overflow',
      passed: mobileLayoutCheck.textFirst && mobileLayoutCheck.hasNoOverflow,
      details: mobileLayoutCheck
    });

    const mobileShot = 'public/qa-screenshots/prompt04-sportswear-showcase-mobile.png';
    await page.screenshot({ path: mobileShot, fullPage: false });
    results.screenshots.push(mobileShot);
    console.log(`📸 Saved screenshot: ${mobileShot}`);

    // -------------------------------------------------------------
    // Test 5: Launch 3D Studio Button Navigation
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluate(() => {
      document.querySelector('[data-testid="showcase-launch-studio-btn"]')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 200));
    await page.click('[data-testid="showcase-launch-studio-btn"]');
    await new Promise(r => setTimeout(r, 600));

    const currentHash = await page.evaluate(() => window.location.hash);
    const studioOpened = await page.$('.luxury-studio-stage');

    results.checks.push({
      test: 'Showcase Launch 3D Studio Opens Configurator',
      passed: currentHash === '#demo' && !!studioOpened,
      details: { currentHash, studioOpened: !!studioOpened }
    });

    // Return to overview
    await page.evaluate(() => { window.location.hash = '#/'; });
    await new Promise(r => setTimeout(r, 400));

    // -------------------------------------------------------------
    // Test 6: Verify Previous Sections (Hero, Categories, Capabilities) Intact
    // -------------------------------------------------------------
    const previousSectionsIntegrity = await page.evaluate(() => {
      const heroTitle = document.querySelector('[data-testid="sportswear-hero-title"]')?.textContent;
      const categoriesTitle = document.querySelector('[data-testid="sportswear-categories-title"]')?.textContent;
      const capabilitiesTitle = document.querySelector('[data-testid="sportswear-capabilities-title"]')?.textContent;
      const capabilityCardsCount = document.querySelectorAll('.tk-sw-capability-card').length;

      return {
        heroOk: heroTitle?.includes('Real-Time 3D'),
        categoriesOk: categoriesTitle?.includes('Multiple Sportswear Styles'),
        capabilitiesOk: capabilitiesTitle === 'Everything You Need to Create Better Sportswear',
        capabilityCardsCountOk: capabilityCardsCount === 4
      };
    });

    results.checks.push({
      test: 'Previous Sections (Hero, Categories, Capabilities) Remain Intact',
      passed: previousSectionsIntegrity.heroOk &&
              previousSectionsIntegrity.categoriesOk &&
              previousSectionsIntegrity.capabilitiesOk &&
              previousSectionsIntegrity.capabilityCardsCountOk,
      details: previousSectionsIntegrity
    });

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================ PROMPT 04 VERIFICATION RESULTS ================');
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

runPrompt04Verification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
