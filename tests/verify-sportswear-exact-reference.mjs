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

function startServer(port = 4192) {
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

async function runExactReferenceVerification() {
  const port = 4192;
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
    // Test 1: Desktop Viewport (1440x900) & Section 1 Verification
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Section 1: Capabilities presence & placement
    const capSection = await page.evaluate(async () => {
      const section = document.querySelector('[data-testid="sportswear-capabilities-section"]');
      if (!section) return null;
      section.scrollIntoView({ behavior: 'instant', block: 'center' });

      const img = document.querySelector('[data-testid="sportswear-capabilities-panels-img"]');
      if (img && !img.complete) {
        await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 3000); });
      }

      const rect = section.getBoundingClientRect();
      const badge = document.querySelector('[data-testid="sportswear-capabilities-badge"]')?.textContent.trim();
      const title = document.querySelector('[data-testid="sportswear-capabilities-title"]')?.textContent.trim().replace(/\s+/g, ' ');
      const desc = document.querySelector('[data-testid="sportswear-capabilities-desc"]')?.textContent.trim();
      
      const featureCols = Array.from(document.querySelectorAll('.tk-sw-feature-col')).map(c => c.textContent.trim().replace(/\s+/g, ' '));
      const seps = document.querySelectorAll('.tk-sw-feature-sep').length;

      const imgData = img ? {
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      } : null;

      const row = document.querySelector('.tk-sw-capabilities-row');
      const gridCols = row ? window.getComputedStyle(row).gridTemplateColumns.split(' ').length : 0;

      return {
        exists: true,
        badge,
        title,
        desc,
        featureCols,
        seps,
        imgData,
        gridCols
      };
    });

    results.checks.push({
      test: 'Section 1 (Studio Capabilities) Content & 3-Column Feature Box',
      passed: !!capSection &&
              capSection.badge === 'STUDIO CAPABILITIES' &&
              capSection.title.includes('From Inspection to') &&
              capSection.title.includes('Full Customization') &&
              capSection.desc.includes('A complete set of 3D tools to visualize, configure, measure, and test') &&
              capSection.featureCols.length === 3 &&
              capSection.featureCols[0].includes('Material') &&
              capSection.featureCols[0].includes('Inspection') &&
              capSection.featureCols[1].includes('Dimension') &&
              capSection.featureCols[1].includes('Measurement') &&
              capSection.featureCols[2].includes('Texture') &&
              capSection.featureCols[2].includes('Color Variants') &&
              capSection.seps === 2,
      details: capSection
    });

    results.checks.push({
      test: 'Section 1 Tilted Panels Image Loaded & Desktop 2-Column Grid',
      passed: !!capSection?.imgData &&
              capSection.imgData.complete &&
              capSection.imgData.naturalWidth > 0 &&
              capSection.imgData.src.includes('sportswear-capabilities-panels.jpg') &&
              capSection.gridCols === 2,
      details: { img: capSection?.imgData, gridCols: capSection?.gridCols }
    });

    // -------------------------------------------------------------
    // Test 2: Section 2 (Real-Time 3D Studio) Verification
    // -------------------------------------------------------------
    const studioSection = await page.evaluate(async () => {
      const section = document.querySelector('[data-testid="sportswear-showcase-section"]');
      if (!section) return null;
      section.scrollIntoView({ behavior: 'instant', block: 'center' });

      const img = document.querySelector('[data-testid="sportswear-showcase-img"]');
      if (img && !img.complete) {
        await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 3000); });
      }

      const badge = document.querySelector('[data-testid="sportswear-showcase-badge"]')?.textContent.trim();
      const title = document.querySelector('[data-testid="sportswear-showcase-title"]')?.textContent.trim().replace(/\s+/g, ' ');
      const desc = document.querySelector('[data-testid="sportswear-showcase-desc"]')?.textContent.trim();
      const btn = document.querySelector('[data-testid="showcase-launch-studio-btn"]')?.textContent.trim();
      const highlighted = document.querySelector('.tk-sw-highlight-orange')?.textContent.trim();

      const imgData = img ? {
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      } : null;

      const row = document.querySelector('.tk-sw-studio-row');
      const gridCols = row ? window.getComputedStyle(row).gridTemplateColumns.split(' ').length : 0;

      return {
        exists: true,
        badge,
        title,
        desc,
        btn,
        highlighted,
        imgData,
        gridCols
      };
    });

    results.checks.push({
      test: 'Section 2 (Real-Time 3D Studio) Content, Orange Highlight & CTA',
      passed: !!studioSection &&
              studioSection.badge === 'REAL-TIME 3D STUDIO' &&
              studioSection.title.includes('Inspect with Confidence') &&
              studioSection.highlighted === 'Confidence' &&
              studioSection.desc.includes('Evaluate lighting, materials, surface quality, and exact measurements in real-time') &&
              studioSection.btn.includes('Launch 3D Studio'),
      details: studioSection
    });

    results.checks.push({
      test: 'Section 2 Laptop Mockup Image Loaded & Desktop 2-Column Grid',
      passed: !!studioSection?.imgData &&
              studioSection.imgData.complete &&
              studioSection.imgData.naturalWidth > 0 &&
              studioSection.imgData.src.includes('sportswear-studio-laptop.jpg') &&
              studioSection.gridCols === 2,
      details: { img: studioSection?.imgData, gridCols: studioSection?.gridCols }
    });

    // Capture Desktop Dark Screenshot of Section 1 (offset for fixed navbar)
    await page.evaluate(() => {
      const cap = document.querySelector('[data-testid="sportswear-capabilities-section"]');
      if (cap) {
        const top = cap.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 80, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));

    const shotDesktopDark = 'public/qa-screenshots/exact-ref-desktop-dark.png';
    await page.screenshot({ path: shotDesktopDark, fullPage: false });
    results.screenshots.push(shotDesktopDark);
    console.log(`📸 Saved screenshot: ${shotDesktopDark}`);

    // Capture Section 2 Screenshot in Desktop Dark
    await page.evaluate(() => {
      const studio = document.querySelector('[data-testid="sportswear-showcase-section"]');
      if (studio) {
        const top = studio.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 80, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotStudioDark = 'public/qa-screenshots/exact-ref-desktop-studio-dark.png';
    await page.screenshot({ path: shotStudioDark, fullPage: false });
    results.screenshots.push(shotStudioDark);
    console.log(`📸 Saved screenshot: ${shotStudioDark}`);

    // Capture Combined Both Sections Screenshot (Desktop Dark)
    await page.setViewport({ width: 1440, height: 1600 });
    await page.evaluate(() => {
      const cap = document.querySelector('[data-testid="sportswear-capabilities-section"]');
      if (cap) {
        const top = cap.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 70, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotBothDark = 'public/qa-screenshots/exact-ref-both-sections-dark.png';
    await page.screenshot({ path: shotBothDark, fullPage: false });
    results.screenshots.push(shotBothDark);
    console.log(`📸 Saved screenshot: ${shotBothDark}`);

    // Reset back to standard desktop viewport
    await page.setViewport({ width: 1440, height: 900 });

    // -------------------------------------------------------------
    // Test 3: Theme Toggle Support (Dark -> Light Mode)
    // -------------------------------------------------------------
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 400));

    const lightThemeMode = await page.evaluate(() => {
      const pageEl = document.querySelector('.tk-sw-page');
      return pageEl?.getAttribute('data-theme');
    });

    results.checks.push({
      test: 'Light Theme Adaptation on Reference Sections',
      passed: lightThemeMode === 'light',
      details: { lightThemeMode }
    });

    await page.evaluate(() => {
      const cap = document.querySelector('[data-testid="sportswear-capabilities-section"]');
      if (cap) {
        const top = cap.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 80, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));

    const shotDesktopLight = 'public/qa-screenshots/exact-ref-desktop-light.png';
    await page.screenshot({ path: shotDesktopLight, fullPage: false });
    results.screenshots.push(shotDesktopLight);
    console.log(`📸 Saved screenshot: ${shotDesktopLight}`);

    // Switch back to dark theme
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 400));

    // -------------------------------------------------------------
    // Test 4: Mobile Responsiveness (390x844 Viewport)
    // -------------------------------------------------------------
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 200));

    const mobileChecks = await page.evaluate(() => {
      const cap = document.querySelector('[data-testid="sportswear-capabilities-section"]');
      const studio = document.querySelector('[data-testid="sportswear-showcase-section"]');
      const bodyWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;

      return {
        bodyWidth,
        scrollWidth,
        hasNoOverflow: scrollWidth <= bodyWidth + 2,
        capExists: !!cap,
        studioExists: !!studio
      };
    });

    results.checks.push({
      test: 'Mobile Layout (390px Viewport) Stacking & Zero Overflow',
      passed: mobileChecks.hasNoOverflow && mobileChecks.capExists && mobileChecks.studioExists,
      details: mobileChecks
    });

    // Mobile screenshot: Section 1
    await page.evaluate(() => {
      const cap = document.querySelector('[data-testid="sportswear-capabilities-section"]');
      if (cap) {
        const top = cap.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 65, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotMobileCap = 'public/qa-screenshots/exact-ref-mobile-capabilities.png';
    await page.screenshot({ path: shotMobileCap, fullPage: false });
    results.screenshots.push(shotMobileCap);
    console.log(`📸 Saved screenshot: ${shotMobileCap}`);

    // Mobile screenshot: Section 2
    await page.evaluate(() => {
      const studio = document.querySelector('[data-testid="sportswear-showcase-section"]');
      if (studio) {
        const top = studio.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 65, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotMobileStudio = 'public/qa-screenshots/exact-ref-mobile-studio.png';
    await page.screenshot({ path: shotMobileStudio, fullPage: false });
    results.screenshots.push(shotMobileStudio);
    console.log(`📸 Saved screenshot: ${shotMobileStudio}`);

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

    const hash = await page.evaluate(() => window.location.hash);
    const studioOpened = await page.$('.luxury-studio-stage');

    results.checks.push({
      test: 'Launch 3D Studio Button Opens Existing Configurator (#demo)',
      passed: hash === '#demo' && !!studioOpened,
      details: { hash, studioOpened: !!studioOpened }
    });

  } catch (err) {
    results.checks.push({
      test: 'Test Runner Execution',
      passed: false,
      error: err.message,
      stack: err.stack
    });
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n================ EXACT REFERENCE VERIFICATION RESULTS ================');
  let allPassed = true;
  for (const check of results.checks) {
    const symbol = check.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol}: ${check.test}`);
    if (check.details) {
      console.log(`   Details: ${JSON.stringify(check.details)}`);
    }
    if (!check.passed) {
      allPassed = false;
      if (check.error) console.log(`   Error: ${check.error}`);
    }
  }
  console.log('=======================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runExactReferenceVerification();
