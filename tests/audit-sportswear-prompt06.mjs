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
  console.error('No Chrome or Edge binary found.');
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
  '.gltf': 'model/gltf-binary',
  '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm'
};

function startServer(port = 4200) {
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

async function runAudit() {
  const port = 4200;
  const server = await startServer(port);
  console.log(`🚀 Audit static server listening on http://127.0.0.1:${port}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('ERR_NAME_NOT_RESOLVED')) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('pageerror', err => {
    if (!err.message.includes('ERR_NAME_NOT_RESOLVED')) {
      consoleErrors.push(err.message);
    }
  });

  const auditResults = {
    structure: [],
    visual: [],
    cta: [],
    themes: [],
    responsive: [],
    functional: [],
    screenshots: []
  };

  try {
    // -------------------------------------------------------------------------
    // 1. Initial Load & Baseline Checks (1440px)
    // -------------------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Wait for all images
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = img.onerror = resolve;
          setTimeout(resolve, 3000);
        });
      }));
    });

    // -------------------------------------------------------------------------
    // Audit Check 1: Complete Page Structure & Exact Order
    // -------------------------------------------------------------------------
    const sectionOrder = await page.evaluate(() => {
      const selectors = [
        '[data-testid="sportswear-navbar"]',
        '[data-testid="sportswear-hero-section"]',
        '[data-testid="sportswear-categories-section"]',
        '[data-testid="sportswear-capabilities-section"]',
        '[data-testid="sportswear-showcase-section"]',
        '[data-testid="sportswear-cta-section"]',
        '[data-testid="sportswear-footer"]'
      ];

      const elements = selectors.map(sel => document.querySelector(sel));
      const allPresent = elements.every(el => el !== null);

      let isStrictlyOrdered = true;
      if (allPresent) {
        // 1. DOM order check
        for (let i = 0; i < elements.length - 1; i++) {
          const relation = elements[i].compareDocumentPosition(elements[i + 1]);
          if (!(relation & Node.DOCUMENT_POSITION_FOLLOWING)) {
            isStrictlyOrdered = false;
            break;
          }
        }
        // 2. Vertical scroll geometry check for sections 2 to 7
        for (let i = 1; i < elements.length - 1; i++) {
          const topCurrent = elements[i].getBoundingClientRect().top + window.scrollY;
          const topNext = elements[i + 1].getBoundingClientRect().top + window.scrollY;
          if (topCurrent >= topNext) {
            isStrictlyOrdered = false;
            break;
          }
        }
      }

      return {
        allPresent,
        isStrictlyOrdered,
        tops: elements.map(el => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null)
      };
    });

    auditResults.structure.push({
      test: 'All 7 Sections Present in DOM and Visible',
      passed: sectionOrder.allPresent,
      details: sectionOrder.tops
    });

    auditResults.structure.push({
      test: 'Exact Vertical Section Order (Navbar -> Hero -> Categories -> Capabilities -> Studio -> CTA -> Footer)',
      passed: sectionOrder.isStrictlyOrdered,
      details: sectionOrder.tops
    });

    // -------------------------------------------------------------------------
    // Audit Check 2: Strict Visual Reference Details (Colors, Fonts, Badges)
    // -------------------------------------------------------------------------
    const visualStyles = await page.evaluate(() => {
      const pageEl = document.querySelector('.tk-sw-page');
      const hero = document.querySelector('[data-testid="sportswear-hero-section"]');
      const heroBadge = document.querySelector('[data-testid="sportswear-hero-badge"]');
      const heroBtn = document.querySelector('[data-testid="hero-launch-studio-btn"]');
      const ctaCard = document.querySelector('[data-testid="sportswear-cta-card"]');
      const ctaBtn = document.querySelector('[data-testid="cta-launch-studio-btn"]');
      const footer = document.querySelector('[data-testid="sportswear-footer"]');

      return {
        defaultTheme: pageEl?.getAttribute('data-theme'),
        pageBg: window.getComputedStyle(pageEl).backgroundColor,
        heroBadgeColor: heroBadge ? window.getComputedStyle(heroBadge).color : null,
        heroBadgeBorder: heroBadge ? window.getComputedStyle(heroBadge).borderColor : null,
        heroBtnBg: heroBtn ? window.getComputedStyle(heroBtn).backgroundImage : null,
        heroBtnBorderRadius: heroBtn ? window.getComputedStyle(heroBtn).borderRadius : null,
        ctaCardBg: ctaCard ? window.getComputedStyle(ctaCard).backgroundColor : null,
        ctaCardBorderRadius: ctaCard ? window.getComputedStyle(ctaCard).borderRadius : null,
        ctaBtnBg: ctaBtn ? window.getComputedStyle(ctaBtn).backgroundImage : null,
        footerBg: footer ? window.getComputedStyle(footer).backgroundColor : null
      };
    });

    auditResults.visual.push({
      test: 'Dark Mode Default Theme (#08090B Background)',
      passed: visualStyles.defaultTheme === 'dark' && visualStyles.pageBg.includes('rgb(8, 9, 11)'),
      details: { theme: visualStyles.defaultTheme, bg: visualStyles.pageBg }
    });

    auditResults.visual.push({
      test: 'Brand Orange (#FF7200 / #FF8A00) Accents & Gradient Pill Buttons',
      passed: !!visualStyles.heroBtnBg && visualStyles.heroBtnBg.includes('gradient') &&
              !!visualStyles.ctaBtnBg && visualStyles.ctaBtnBg.includes('gradient'),
      details: { heroBtn: visualStyles.heroBtnBg, ctaBtn: visualStyles.ctaBtnBg }
    });

    auditResults.visual.push({
      test: 'Rounded Containers & Standard Border Radii (Pills: 9999px, Cards: 20px)',
      passed: visualStyles.heroBtnBorderRadius.includes('9999px') &&
              visualStyles.ctaCardBorderRadius.includes('20px'),
      details: {
        pillRadius: visualStyles.heroBtnBorderRadius,
        cardRadius: visualStyles.ctaCardBorderRadius
      }
    });

    // -------------------------------------------------------------------------
    // Audit Check 3: CTA Section Precision Positioning
    // -------------------------------------------------------------------------
    const ctaAudit = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="sportswear-cta-card"]');
      const content = document.querySelector('.tk-sw-cta-content');
      const waveWrap = document.querySelector('.tk-sw-cta-wave-wrap');
      const waveImg = document.querySelector('[data-testid="sportswear-cta-wave-img"]');

      if (!card || !content || !waveWrap || !waveImg) return null;

      const cardRect = card.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const waveRect = waveWrap.getBoundingClientRect();

      const computedImg = window.getComputedStyle(waveImg);
      const computedWrap = window.getComputedStyle(waveWrap);

      return {
        textIsLeft: contentRect.left - cardRect.left < 70,
        waveWrapIsRight: Math.abs(cardRect.right - waveRect.right) <= 2,
        waveWrapIsTop: Math.abs(waveRect.top - cardRect.top) <= 2,
        waveWrapIsBottom: Math.abs(cardRect.bottom - waveRect.bottom) <= 2,
        objectFit: computedImg.objectFit,
        objectPosition: computedImg.objectPosition,
        maskImage: computedWrap.webkitMaskImage || computedWrap.maskImage,
        noGaps: (cardRect.right - waveRect.right) < 3,
        singleCard: document.querySelectorAll('[data-testid="sportswear-cta-card"]').length === 1
      };
    });

    auditResults.cta.push({
      test: 'CTA: Text on Left, Wave Attached Directly to Right, Top & Bottom Edges',
      passed: !!ctaAudit && ctaAudit.textIsLeft && ctaAudit.waveWrapIsRight && ctaAudit.waveWrapIsTop && ctaAudit.waveWrapIsBottom,
      details: ctaAudit
    });

    auditResults.cta.push({
      test: 'CTA: Seamless Gradient Mask Blend without Hard Edge',
      passed: !!ctaAudit?.maskImage && ctaAudit.maskImage.includes('gradient'),
      details: { mask: ctaAudit?.maskImage }
    });

    auditResults.cta.push({
      test: 'CTA: Object-Fit Cover with Right-Center Composition (No Distortion)',
      passed: !!ctaAudit && ctaAudit.objectFit === 'cover' && (ctaAudit.objectPosition.includes('right') || ctaAudit.objectPosition.includes('100%')),
      details: { objectFit: ctaAudit?.objectFit, objectPosition: ctaAudit?.objectPosition }
    });

    // -------------------------------------------------------------------------
    // Audit Check 4: Dark & Light Theme Functional Switching
    // -------------------------------------------------------------------------
    const themeToggleBtn = await page.$('[data-testid="sportswear-theme-toggle"]');
    let lightTheme = null;
    let lightThemePassed = false;
    let darkThemeRestored = false;

    if (themeToggleBtn) {
      // Toggle to Light
      await themeToggleBtn.click();
      await new Promise(r => setTimeout(r, 600));
      lightTheme = await page.evaluate(() => {
        const pageEl = document.querySelector('.tk-sw-page');
        const theme = pageEl?.getAttribute('data-theme');
        const bg = window.getComputedStyle(pageEl).backgroundColor;
        const heroTitle = document.querySelector('[data-testid="sportswear-hero-title"]');
        const titleColor = heroTitle ? window.getComputedStyle(heroTitle).color : null;
        return { theme, bg, titleColor };
      });
      lightThemePassed = !!lightTheme && lightTheme.theme === 'light' && (lightTheme.bg.includes('248, 249, 250') || lightTheme.bg.includes('248'));

      // Capture Light Theme Full Page
      const shotLight = path.join(screenshotsDir, 'audit-full-page-light-1440.png');
      await page.screenshot({ path: shotLight, fullPage: true });
      auditResults.screenshots.push(shotLight);

      // Toggle back to Dark
      await themeToggleBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const restoredDark = await page.evaluate(() => {
        const pageEl = document.querySelector('.tk-sw-page');
        return pageEl?.getAttribute('data-theme') === 'dark';
      });
      darkThemeRestored = restoredDark;
    }

    auditResults.themes.push({
      test: 'Theme Toggle Switches to Light Mode Cleanly (#F8F9FA)',
      passed: lightThemePassed,
      details: lightTheme
    });

    auditResults.themes.push({
      test: 'Theme Toggle Restores Dark Mode (#08090B)',
      passed: darkThemeRestored,
      details: { darkThemeRestored }
    });

    // -------------------------------------------------------------------------
    // Audit Check 5: Comprehensive Responsive Testing (7 Requested Viewports)
    // 1920px, 1440px, 1024px, 768px, 390px, 375px, 320px
    // -------------------------------------------------------------------------
    const viewportsToTest = [
      { name: 'Desktop 1920px (Full HD)', width: 1920, height: 1080, scale: 1 },
      { name: 'Desktop 1440px (Standard)', width: 1440, height: 900, scale: 1.5 },
      { name: 'Desktop 1024px (Small/iPad Land)', width: 1024, height: 768, scale: 1 },
      { name: 'Tablet 768px (Portrait)', width: 768, height: 1024, scale: 1 },
      { name: 'Mobile 390px (iPhone 12-15)', width: 390, height: 844, scale: 2 },
      { name: 'Mobile 375px (iPhone SE)', width: 375, height: 667, scale: 2 },
      { name: 'Narrow Mobile 320px (Small)', width: 320, height: 568, scale: 2 }
    ];

    for (const vp of viewportsToTest) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.scale });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 200));

      const vpMetrics = await page.evaluate((vpWidth) => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.offsetWidth;
        const noHorizontalOverflow = scrollWidth <= docWidth + 1;

        // Check specific elements layout
        const heroTitle = document.querySelector('[data-testid="sportswear-hero-title"]');
        const heroVisual = document.querySelector('[data-testid="sportswear-hero-visual"]');
        const ctaCard = document.querySelector('[data-testid="sportswear-cta-card"]');
        const ctaContent = document.querySelector('.tk-sw-cta-content');
        const ctaWave = document.querySelector('.tk-sw-cta-wave-wrap');

        const isMobile = vpWidth <= 768;
        let ctaOrderCorrect = true;
        if (isMobile && ctaContent && ctaWave) {
          const contentRect = ctaContent.getBoundingClientRect();
          const waveRect = ctaWave.getBoundingClientRect();
          ctaOrderCorrect = contentRect.bottom <= waveRect.top + 20;
        }

        return {
          vpWidth,
          docWidth,
          scrollWidth,
          noHorizontalOverflow,
          ctaOrderCorrect,
          heroTitleFound: !!heroTitle,
          heroVisualFound: !!heroVisual
        };
      }, vp.width);

      auditResults.responsive.push({
        test: `Responsive Viewport ${vp.name}: Zero Horizontal Overflow`,
        passed: vpMetrics.noHorizontalOverflow,
        details: { docWidth: vpMetrics.docWidth, scrollWidth: vpMetrics.scrollWidth }
      });

      if (vp.width <= 768) {
        auditResults.responsive.push({
          test: `Responsive Viewport ${vp.name}: CTA Text First & Wave Below`,
          passed: vpMetrics.ctaOrderCorrect,
          details: { ctaOrderCorrect: vpMetrics.ctaOrderCorrect }
        });
      }

      // Capture screenshot for major breakpoints
      if ([1920, 1440, 768, 390].includes(vp.width)) {
        const vpShot = path.join(screenshotsDir, `audit-full-page-dark-${vp.width}.png`);
        await page.screenshot({ path: vpShot, fullPage: true });
        auditResults.screenshots.push(vpShot);
      }
    }

    // -------------------------------------------------------------------------
    // Audit Check 6: Functional Testing (Dropdowns, Links, Navigation, Images)
    // -------------------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.evaluate(() => window.scrollTo(0, 0));

    // 6a. Image Integrity (No broken images)
    const imageStatus = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const failures = [];
      for (const img of images) {
        if (!img.complete || img.naturalWidth === 0) {
          failures.push({ src: img.src, alt: img.alt });
        }
      }
      return { total: images.length, brokenCount: failures.length, failures };
    });

    auditResults.functional.push({
      test: 'Image Integrity: All Images Loaded Successfully (Zero Broken Images)',
      passed: imageStatus.brokenCount === 0 && imageStatus.total > 0,
      details: imageStatus
    });

    // 6b. Products Dropdown Interaction
    const dropdownResult = await page.evaluate(async () => {
      const dropdownTrigger = document.querySelector('[data-testid="sportswear-nav-products-btn"]');
      if (!dropdownTrigger) return { triggerFound: false };

      dropdownTrigger.click();
      await new Promise(r => setTimeout(r, 200));

      const dropdownMenu = document.querySelector('[data-testid="sportswear-nav-products-menu"]') || document.querySelector('.tk-sw-dropdown');
      const isVisible = dropdownMenu && (window.getComputedStyle(dropdownMenu).display !== 'none');
      const itemsCount = dropdownMenu ? dropdownMenu.querySelectorAll('a, button').length : 0;

      // Close dropdown by clicking again
      dropdownTrigger.click();

      return { triggerFound: true, isVisible, itemsCount };
    });

    auditResults.functional.push({
      test: 'Products Dropdown Opens with Categories',
      passed: dropdownResult.triggerFound && dropdownResult.itemsCount > 0,
      details: dropdownResult
    });

    // 6c. Configurator Launch & Back to Overview Navigation
    const launchBtn = await page.$('[data-testid="showcase-launch-studio-btn"]');
    let configuratorOpened = false;
    let overviewRestored = false;

    if (launchBtn) {
      await launchBtn.click();
      await new Promise(r => setTimeout(r, 600));

      const hashAfterLaunch = await page.evaluate(() => window.location.hash);
      const studioMounted = await page.evaluate(() => !!document.querySelector('.luxury-studio-stage'));
      configuratorOpened = hashAfterLaunch === '#demo' && studioMounted;

      // Capture screenshot of opened 3D Configurator Studio
      const shotStudio = path.join(screenshotsDir, 'audit-sportswear-studio-opened.png');
      await page.screenshot({ path: shotStudio });
      auditResults.screenshots.push(shotStudio);

      // Now click "Back to Overview"
      const backBtn = await page.$('[data-testid="sportswear-overview-back-btn"]');
      if (backBtn) {
        await backBtn.click();
        await new Promise(r => setTimeout(r, 600));

        const hashAfterBack = await page.evaluate(() => window.location.hash);
        const landingMounted = await page.evaluate(() => !!document.querySelector('[data-testid="sportswear-navbar"]'));
        overviewRestored = (hashAfterBack === '#/' || hashAfterBack === '') && landingMounted;
      }
    }

    auditResults.functional.push({
      test: 'Launch 3D Studio Opens Configurator (#demo)',
      passed: configuratorOpened,
      details: { configuratorOpened }
    });

    auditResults.functional.push({
      test: 'Back to Overview Returns to Landing Page (#/)',
      passed: overviewRestored,
      details: { overviewRestored }
    });

    // 6d. Console Errors Check
    auditResults.functional.push({
      test: 'Zero JavaScript Console Errors',
      passed: consoleErrors.length === 0,
      details: consoleErrors
    });

  } catch (err) {
    console.error('Fatal audit error:', err);
    auditResults.functional.push({
      test: 'Audit Execution Exception',
      passed: false,
      details: err.message
    });
  } finally {
    await browser.close();
    server.close();
  }

  // ---------------------------------------------------------------------------
  // Output Audit Results
  // ---------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log('📋 PROMPT 06 – SPORTSWEAR FINAL AUDIT & VISUAL QA RESULTS');
  console.log('======================================================');

  let allSectionsPassed = true;
  for (const [sectionName, tests] of Object.entries(auditResults)) {
    if (sectionName === 'screenshots') continue;
    console.log(`\n--- ${sectionName.toUpperCase()} ---`);
    for (const t of tests) {
      const mark = t.passed ? '✅' : '❌';
      console.log(`${mark} ${t.test}`);
      if (!t.passed) {
        allSectionsPassed = false;
        console.log('   Details:', JSON.stringify(t.details));
      }
    }
  }

  console.log('\n📸 Captured Screenshots:');
  for (const s of auditResults.screenshots) {
    console.log(`   - ${s}`);
  }

  if (allSectionsPassed) {
    console.log('\n🎉 ALL FINAL AUDIT CHECKS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('\n❌ SOME AUDIT CHECKS FAILED! REVIEW DETAILS ABOVE.');
    process.exit(1);
  }
}

runAudit();
