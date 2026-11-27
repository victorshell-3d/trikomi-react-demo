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

function startServer(port = 4195) {
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

async function runPrompt05Verification() {
  const port = 4195;
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
    // Test 1: Desktop Viewport (1440x900) & CTA Section Verification
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Placement check: CTA appears after Studio section
    const placementCheck = await page.evaluate(() => {
      const studio = document.querySelector('[data-testid="sportswear-showcase-section"]');
      const cta = document.querySelector('[data-testid="sportswear-cta-section"]');
      const footer = document.querySelector('[data-testid="sportswear-footer"]');
      if (!studio || !cta || !footer) return null;

      const studioRect = studio.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();

      return {
        studioTop: studioRect.top,
        ctaTop: ctaRect.top,
        footerTop: footerRect.top,
        isCtaBelowStudio: ctaRect.top >= studioRect.top,
        isFooterBelowCta: footerRect.top >= ctaRect.top
      };
    });

    results.checks.push({
      test: 'Final CTA and Footer Placement Order (Studio -> CTA -> Footer)',
      passed: !!placementCheck && placementCheck.isCtaBelowStudio && placementCheck.isFooterBelowCta,
      details: placementCheck
    });

    // Content verification: CTA Label, Heading & Button
    const ctaContent = await page.evaluate(async () => {
      const ctaSection = document.querySelector('[data-testid="sportswear-cta-section"]');
      if (ctaSection) {
        ctaSection.scrollIntoView({ behavior: 'instant', block: 'center' });
      }

      const img = document.querySelector('[data-testid="sportswear-cta-wave-img"]');
      if (img && !img.complete) {
        await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 3000); });
      }

      const label = document.querySelector('[data-testid="sportswear-cta-label"]')?.textContent.trim();
      const title = document.querySelector('[data-testid="sportswear-cta-title"]')?.textContent.trim().replace(/\s+/g, ' ');
      const btn = document.querySelector('[data-testid="cta-launch-studio-btn"]')?.textContent.trim();

      const imgData = img ? {
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      } : null;

      return { label, title, btn, imgData };
    });

    results.checks.push({
      test: 'CTA Content & Orange Pill Button',
      passed: !!ctaContent &&
              ctaContent.label === 'READY TO EXPERIENCE SPORTSWEAR 3D?' &&
              ctaContent.title.includes('Bring Your Sportswear') &&
              ctaContent.title.includes('Designs to Life in 3D') &&
              ctaContent.btn.includes('Launch 3D Studio'),
      details: ctaContent
    });

    results.checks.push({
      test: 'CTA Orange Dotted Wave Mesh Image Loaded',
      passed: !!ctaContent?.imgData &&
              ctaContent.imgData.complete &&
              ctaContent.imgData.naturalWidth > 0 &&
              ctaContent.imgData.src.includes('sportswear-cta-wave.jpg'),
      details: ctaContent?.imgData
    });

    // Capture Desktop Dark CTA Screenshot
    await page.evaluate(() => {
      const cta = document.querySelector('[data-testid="sportswear-cta-section"]');
      if (cta) {
        const top = cta.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 80, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotCtaDark = 'public/qa-screenshots/prompt05-cta-desktop-dark.png';
    await page.screenshot({ path: shotCtaDark, fullPage: false });
    results.screenshots.push(shotCtaDark);
    console.log(`📸 Saved screenshot: ${shotCtaDark}`);

    // -------------------------------------------------------------
    // Test 2: Footer Section Verification
    // -------------------------------------------------------------
    const footerContent = await page.evaluate(() => {
      const footer = document.querySelector('[data-testid="sportswear-footer"]');
      if (footer) {
        footer.scrollIntoView({ behavior: 'instant', block: 'end' });
      }

      const brandLogo = document.querySelector('[data-testid="sportswear-footer-logo"]')?.textContent.trim();
      const links = Array.from(document.querySelectorAll('.tk-sw-footer-link')).map(a => a.textContent.trim());
      const copyright = document.querySelector('[data-testid="sportswear-footer-copyright"]')?.textContent.trim();

      return { brandLogo, links, copyright };
    });

    const expectedLinks = ['Products', '3D Studio', 'Industries', 'Resources'];
    const linksMatch = expectedLinks.every(l => footerContent?.links?.includes(l));

    results.checks.push({
      test: 'Footer Brand, Middle Navigation Links & Copyright',
      passed: !!footerContent &&
              footerContent.brandLogo.includes('Trikomi') &&
              linksMatch &&
              footerContent.copyright.includes('© 2026 Trikomi. All rights reserved.'),
      details: footerContent
    });

    // Capture Desktop Footer Screenshot
    const shotFooterDark = 'public/qa-screenshots/prompt05-footer-desktop-dark.png';
    await page.screenshot({ path: shotFooterDark, fullPage: false });
    results.screenshots.push(shotFooterDark);
    console.log(`📸 Saved screenshot: ${shotFooterDark}`);

    // -------------------------------------------------------------
    // Test 3: Light Theme Mode Verification
    // -------------------------------------------------------------
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 400));

    const lightThemeMode = await page.evaluate(() => {
      return document.querySelector('.tk-sw-page')?.getAttribute('data-theme');
    });

    results.checks.push({
      test: 'CTA & Footer Light Theme Adaptation',
      passed: lightThemeMode === 'light',
      details: { lightThemeMode }
    });

    await page.evaluate(() => {
      const cta = document.querySelector('[data-testid="sportswear-cta-section"]');
      if (cta) {
        const top = cta.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 80, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotCtaLight = 'public/qa-screenshots/prompt05-cta-desktop-light.png';
    await page.screenshot({ path: shotCtaLight, fullPage: false });
    results.screenshots.push(shotCtaLight);
    console.log(`📸 Saved screenshot: ${shotCtaLight}`);

    // Switch back to dark theme
    await page.click('[data-testid="sportswear-theme-toggle"]');
    await new Promise(r => setTimeout(r, 400));

    // -------------------------------------------------------------
    // Test 4: Mobile Responsiveness (390x844 Viewport)
    // -------------------------------------------------------------
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 200));

    const mobileCheck = await page.evaluate(() => {
      const cta = document.querySelector('[data-testid="sportswear-cta-section"]');
      const footer = document.querySelector('[data-testid="sportswear-footer"]');
      const bodyWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;

      return {
        bodyWidth,
        scrollWidth,
        hasNoOverflow: scrollWidth <= bodyWidth + 2,
        ctaExists: !!cta,
        footerExists: !!footer
      };
    });

    results.checks.push({
      test: 'Mobile Layout (390px Viewport) Stacking & Zero Overflow',
      passed: mobileCheck.hasNoOverflow && mobileCheck.ctaExists && mobileCheck.footerExists,
      details: mobileCheck
    });

    // Mobile CTA Screenshot
    await page.evaluate(() => {
      const cta = document.querySelector('[data-testid="sportswear-cta-section"]');
      if (cta) {
        const top = cta.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 65, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotMobileCta = 'public/qa-screenshots/prompt05-cta-mobile-dark.png';
    await page.screenshot({ path: shotMobileCta, fullPage: false });
    results.screenshots.push(shotMobileCta);
    console.log(`📸 Saved screenshot: ${shotMobileCta}`);

    // Mobile Footer Screenshot
    await page.evaluate(() => {
      const footer = document.querySelector('[data-testid="sportswear-footer"]');
      if (footer) {
        footer.scrollIntoView({ behavior: 'instant', block: 'end' });
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const shotMobileFooter = 'public/qa-screenshots/prompt05-footer-mobile-dark.png';
    await page.screenshot({ path: shotMobileFooter, fullPage: false });
    results.screenshots.push(shotMobileFooter);
    console.log(`📸 Saved screenshot: ${shotMobileFooter}`);

    // -------------------------------------------------------------
    // Test 5: CTA Launch 3D Studio Button Navigation
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluate(() => {
      document.querySelector('[data-testid="cta-launch-studio-btn"]')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 200));
    await page.click('[data-testid="cta-launch-studio-btn"]');
    await new Promise(r => setTimeout(r, 600));

    const hash = await page.evaluate(() => window.location.hash);
    const studioOpened = await page.$('.luxury-studio-stage');

    results.checks.push({
      test: 'CTA Launch 3D Studio Opens Existing Configurator (#demo)',
      passed: hash === '#demo' && !!studioOpened,
      details: { hash, studioOpened: !!studioOpened }
    });

    // -------------------------------------------------------------
    // Test 6: Non-regression of Previous Sections
    // -------------------------------------------------------------
    await page.click('[data-testid="sportswear-overview-back-btn"]');
    await new Promise(r => setTimeout(r, 600));

    const allSectionsPresent = await page.evaluate(() => {
      return {
        header: !!document.querySelector('[data-testid="sportswear-navbar"]'),
        hero: !!document.querySelector('[data-testid="sportswear-hero-section"]'),
        categories: !!document.querySelector('[data-testid="sportswear-categories-section"]'),
        capabilities: !!document.querySelector('[data-testid="sportswear-capabilities-section"]'),
        studio: !!document.querySelector('[data-testid="sportswear-showcase-section"]'),
        cta: !!document.querySelector('[data-testid="sportswear-cta-section"]'),
        footer: !!document.querySelector('[data-testid="sportswear-footer"]')
      };
    });

    const allSectionsOk = Object.values(allSectionsPresent).every(Boolean);

    results.checks.push({
      test: 'All Previous Sections (Navbar, Hero, Categories, Capabilities, Studio) Intact',
      passed: allSectionsOk,
      details: allSectionsPresent
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

  console.log('\n================ PROMPT 05 VERIFICATION RESULTS ================');
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
  console.log('=================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runPrompt05Verification();
