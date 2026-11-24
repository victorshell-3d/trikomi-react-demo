import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const distDir = path.resolve('dist/viewer');
const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) {
    const distRootPath = path.resolve('dist', reqPath.replace(/^\//, ''));
    const publicPath = path.resolve('public', reqPath.replace(/^\//, ''));
    if (fs.existsSync(distRootPath)) {
      filePath = distRootPath;
    } else if (fs.existsSync(publicPath)) {
      filePath = publicPath;
    } else {
      res.writeHead(404);
      return res.end('Not found: ' + reqPath);
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(5199, async () => {
  console.log('QA Server running on http://localhost:5199');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const qaResults = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    consoleErrors: [],
    failedRequests: [],
    imageAudits: [],
    viewports: {},
    themeAudit: {},
    demoStudioAudit: {}
  };

  // Collect console messages
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' && !text.includes('favicon')) {
      qaResults.consoleErrors.push(text);
    }
  });

  // Collect failed network requests
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      qaResults.failedRequests.push({ url: res.url(), status: res.status() });
    }
  });

  console.log('\n--- 1. TESTING LANDING PAGE LOAD & ASSETS (1440x900) ---');
  qaResults.totalTests++;
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5199', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  // Audit all image tags on landing page
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      visible: img.offsetWidth > 0 && img.offsetHeight > 0,
      broken: img.naturalWidth === 0
    }));
  });
  qaResults.imageAudits = images;
  const brokenImages = images.filter(i => i.broken);
  console.log(`Audited ${images.length} images. Broken images count: ${brokenImages.length}`);
  if (brokenImages.length === 0) {
    qaResults.passed++;
  } else {
    qaResults.failed++;
    console.error('Broken images found:', brokenImages);
  }

  // Check transparent header
  qaResults.totalTests++;
  const navbarCheck = await page.evaluate(() => {
    const nav = document.querySelector('.tk-navbar');
    if (!nav) return { found: false };
    const style = window.getComputedStyle(nav);
    return {
      found: true,
      bg: style.backgroundColor,
      position: style.position,
      hasBorder: style.borderWidth !== '0px'
    };
  });
  console.log('Navbar Check:', navbarCheck);
  if (navbarCheck.found) qaResults.passed++; else qaResults.failed++;

  // --- 2. THEME SWITCHING AUDIT ---
  console.log('\n--- 2. TESTING THEME SWITCHING (DARK <-> LIGHT) ---');
  qaResults.totalTests++;
  
  // Switch to Dark Theme first
  await page.evaluate(() => {
    localStorage.setItem('vs_theme_mode', 'dark');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));

  const darkAudit = await page.evaluate(() => {
    const pageEl = document.querySelector('.tk-viewer-page');
    const hero = document.querySelector('.tk-hero');
    const confSec = document.querySelector('.tk-confidence-section');
    const bottom = document.querySelector('.tk-bottom-integrated');
    const ctaTitle = document.querySelector('.tk-cta-title');
    const footerCopy = document.querySelector('.tk-footer__copy');
    return {
      theme: pageEl?.getAttribute('data-theme'),
      confBg: window.getComputedStyle(confSec).backgroundColor,
      bottomBg: window.getComputedStyle(bottom).backgroundColor,
      ctaTitleColor: window.getComputedStyle(ctaTitle).color,
      footerCopyColor: window.getComputedStyle(footerCopy).color
    };
  });
  console.log('Dark Theme Audit:', darkAudit);

  // Capture Dark Full-Page Screenshot
  await page.screenshot({ path: path.join(outDir, 'qa-landing-dark-desktop.png'), fullPage: true });

  // Toggle to Light Theme live
  await page.evaluate(() => {
    const toggle = document.querySelector('.tk-theme-toggle');
    if (toggle) toggle.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const lightAudit = await page.evaluate(() => {
    const pageEl = document.querySelector('.tk-viewer-page');
    const confSec = document.querySelector('.tk-confidence-section');
    const bottom = document.querySelector('.tk-bottom-integrated');
    const ctaTitle = document.querySelector('.tk-cta-title');
    const footerCopy = document.querySelector('.tk-footer__copy');
    return {
      theme: pageEl?.getAttribute('data-theme'),
      confBg: window.getComputedStyle(confSec).backgroundColor,
      bottomBg: window.getComputedStyle(bottom).backgroundImage || window.getComputedStyle(bottom).backgroundColor,
      ctaTitleColor: window.getComputedStyle(ctaTitle).color,
      footerCopyColor: window.getComputedStyle(footerCopy).color
    };
  });
  console.log('Light Theme Audit:', lightAudit);
  qaResults.themeAudit = { dark: darkAudit, light: lightAudit };

  // Verify light theme has light background and dark text
  const isLightValid = lightAudit.theme === 'light' && lightAudit.ctaTitleColor === 'rgb(15, 23, 42)';
  if (isLightValid) qaResults.passed++; else qaResults.failed++;

  // Capture Light Full-Page Screenshot
  await page.screenshot({ path: path.join(outDir, 'qa-landing-light-desktop.png'), fullPage: true });

  // Test Persistence on reload
  qaResults.totalTests++;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  const persistedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  console.log('Persisted Theme after reload:', persistedTheme);
  if (persistedTheme === 'light') qaResults.passed++; else qaResults.failed++;

  // --- 3. 3D STUDIO / DEMO ROUTE TESTING ---
  console.log('\n--- 3. TESTING 3D STUDIO INTERACTION (#demo) ---');
  qaResults.totalTests++;
  await page.goto('http://localhost:5199/#demo', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const demoStudioCheck = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const sidebar = document.querySelector('.sidebar') || document.querySelector('[class*="sidebar"]') || document.querySelector('aside');
    const toolbar = document.querySelector('.toolbar') || document.querySelector('[class*="toolbar"]');
    const backBtn = document.querySelector('button');
    return {
      hasCanvas: Boolean(canvas),
      canvasWidth: canvas?.clientWidth || 0,
      canvasHeight: canvas?.clientHeight || 0,
      hasControls: Boolean(sidebar || toolbar)
    };
  });
  console.log('3D Studio Check:', demoStudioCheck);
  qaResults.demoStudioAudit = demoStudioCheck;
  if (demoStudioCheck.hasCanvas && demoStudioCheck.canvasWidth > 0) qaResults.passed++; else qaResults.failed++;

  await page.screenshot({ path: path.join(outDir, 'qa-demo-studio-live.png') });

  // --- 4. RESPONSIVE TESTING ACROSS 5 VIEWPORTS ---
  console.log('\n--- 4. TESTING RESPONSIVE SIZES ---');
  const viewports = [
    { name: 'desktop-1920', width: 1920, height: 1080 },
    { name: 'laptop-1440', width: 1440, height: 900 },
    { name: 'laptop-1366', width: 1366, height: 768 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 }
  ];

  await page.goto('http://localhost:5199/#/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));

  for (const vp of viewports) {
    qaResults.totalTests++;
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.width < 768 ? 2 : 1 });
    await new Promise(r => setTimeout(r, 400));

    const vpMetrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const hasHScroll = doc.scrollWidth > window.innerWidth;
      return {
        innerWidth: window.innerWidth,
        scrollWidth: doc.scrollWidth,
        hasHScroll
      };
    });

    console.log(`Viewport [${vp.name}]:`, vpMetrics);
    qaResults.viewports[vp.name] = vpMetrics;

    if (!vpMetrics.hasHScroll) {
      qaResults.passed++;
    } else {
      qaResults.failed++;
      console.error(`Horizontal scroll detected at ${vp.name}! ScrollWidth: ${vpMetrics.scrollWidth}, InnerWidth: ${vpMetrics.innerWidth}`);
    }

    // Capture screenshot at this viewport
    await page.screenshot({ path: path.join(outDir, `qa-viewport-${vp.name}.png`) });
  }

  // --- 5. INTERACTIVE SECTION AUDIT: Configure with Confidence ---
  console.log('\n--- 5. TESTING CONFIGURE WITH CONFIDENCE SECTION ---');
  qaResults.totalTests++;
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));

  const confidenceAudit = await page.evaluate(() => {
    const leftImg = document.querySelector('.tk-confidence-artwork');
    const mockup = document.querySelector('.tk-confidence-console-wrap, .tk-mockup-frame');
    const swatches = document.querySelectorAll('.tk-console-swatch-hit, .tk-mockup-sphere');
    const tools = document.querySelectorAll('.tk-mockup-tool-btn, .tk-console-img');
    return {
      leftImgComplete: leftImg?.complete,
      leftImgNaturalW: leftImg?.naturalWidth,
      leftImgNaturalH: leftImg?.naturalHeight,
      hasMockup: Boolean(mockup),
      swatchesCount: swatches.length,
      toolsCount: tools.length
    };
  });
  console.log('Confidence Section Audit:', confidenceAudit);
  if (confidenceAudit.leftImgComplete && confidenceAudit.leftImgNaturalW > 0 && confidenceAudit.hasMockup && confidenceAudit.toolsCount > 0) {
    qaResults.passed++;
  } else {
    qaResults.failed++;
  }

  // --- 6. FINAL SUMMARY ---
  console.log('\n========================================');
  console.log('       QA TEST RESULTS SUMMARY');
  console.log('========================================');
  console.log(`Total Tests Run : ${qaResults.totalTests}`);
  console.log(`Passed          : ${qaResults.passed}`);
  console.log(`Failed          : ${qaResults.failed}`);
  console.log(`Console Errors  : ${qaResults.consoleErrors.length}`);
  console.log(`Failed Requests : ${qaResults.failedRequests.length}`);
  if (qaResults.failedRequests.length > 0) {
    console.log('Failed Requests Details:', qaResults.failedRequests);
  }
  if (qaResults.consoleErrors.length > 0) {
    console.log('Console Errors Details:', qaResults.consoleErrors);
  }
  console.log('========================================\n');

  // Write results JSON for report compilation
  fs.writeFileSync(path.join(outDir, 'qa-results.json'), JSON.stringify(qaResults, null, 2), 'utf8');

  await browser.close();
  server.close();
  process.exit(0);
});
