import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist', 'sportswear-configurator');
const screenshotsDir = path.join(repoRoot, 'public', 'qa-screenshots');

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

function startServer(port = 4199) {
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

async function verify() {
  const port = 4199;
  const server = await startServer(port);
  console.log(`🚀 Static server running on http://127.0.0.1:${port}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  const checks = [];

  try {
    // 1. Desktop Verification (1440x900)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // Wait for CTA wave image
    await page.evaluate(async () => {
      const img = document.querySelector('[data-testid="sportswear-cta-wave-img"]');
      if (img && !img.complete) {
        await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 3000); });
      }
    });

    const desktopCTA = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="sportswear-cta-card"]');
      const content = document.querySelector('.tk-sw-cta-content');
      const waveWrap = document.querySelector('.tk-sw-cta-wave-wrap');
      const waveImg = document.querySelector('[data-testid="sportswear-cta-wave-img"]');
      const label = document.querySelector('[data-testid="sportswear-cta-label"]');
      const title = document.querySelector('[data-testid="sportswear-cta-title"]');
      const btn = document.querySelector('[data-testid="cta-launch-studio-btn"]');

      if (!card || !content || !waveWrap || !waveImg) return null;

      const cardRect = card.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const waveRect = waveWrap.getBoundingClientRect();
      const computedWrap = window.getComputedStyle(waveWrap);
      const computedImg = window.getComputedStyle(waveImg);
      const computedCard = window.getComputedStyle(card);

      return {
        cardWidth: cardRect.width,
        cardHeight: cardRect.height,
        cardBorderRadius: computedCard.borderRadius,
        cardBg: computedCard.backgroundColor,
        contentLeft: contentRect.left - cardRect.left,
        contentWidth: contentRect.width,
        waveWrapRight: cardRect.right - waveRect.right,
        waveWrapWidth: waveRect.width,
        waveWrapTop: waveRect.top - cardRect.top,
        waveWrapBottom: cardRect.bottom - waveRect.bottom,
        objectFit: computedImg.objectFit,
        objectPosition: computedImg.objectPosition,
        maskImage: computedWrap.webkitMaskImage || computedWrap.maskImage,
        hasLabel: !!label && label.textContent.includes('READY TO EXPERIENCE SPORTSWEAR 3D?'),
        hasTitle: !!title && title.textContent.includes('Bring Your Sportswear') && title.textContent.includes('Designs to Life in 3D'),
        hasBtn: !!btn && btn.textContent.includes('Launch 3D Studio')
      };
    });

    checks.push({
      test: 'CTA Desktop: Text on Left & Wave on Right',
      passed: !!desktopCTA && desktopCTA.contentLeft < 60 && desktopCTA.contentWidth > 300,
      details: desktopCTA
    });

    checks.push({
      test: 'CTA Desktop: Wave Attached to Right, Top & Bottom Edge',
      passed: !!desktopCTA &&
              Math.abs(desktopCTA.waveWrapRight) <= 2 &&
              Math.abs(desktopCTA.waveWrapTop) <= 2 &&
              Math.abs(desktopCTA.waveWrapBottom) <= 2,
      details: {
        waveWrapRight: desktopCTA?.waveWrapRight,
        waveWrapTop: desktopCTA?.waveWrapTop,
        waveWrapBottom: desktopCTA?.waveWrapBottom
      }
    });

    checks.push({
      test: 'CTA Desktop: Object-Fit Cover & Right-Center Positioning',
      passed: !!desktopCTA &&
              desktopCTA.objectFit === 'cover' &&
              (desktopCTA.objectPosition.includes('right') || desktopCTA.objectPosition.includes('100%')),
      details: {
        objectFit: desktopCTA?.objectFit,
        objectPosition: desktopCTA?.objectPosition
      }
    });

    checks.push({
      test: 'CTA Desktop: Gradient Mask for Seamless Left Blend',
      passed: !!desktopCTA && desktopCTA.maskImage.includes('gradient'),
      details: { maskImage: desktopCTA?.maskImage }
    });

    checks.push({
      test: 'CTA Desktop: Rounded Card & Dark Background Preserved',
      passed: !!desktopCTA &&
              desktopCTA.cardBorderRadius.includes('20px') &&
              desktopCTA.cardBg.includes('rgb(8, 9, 11)'),
      details: {
        borderRadius: desktopCTA?.cardBorderRadius,
        backgroundColor: desktopCTA?.cardBg
      }
    });

    // Capture CTA Section Desktop Dark
    const ctaSec = await page.$('[data-testid="sportswear-cta-section"]');
    if (ctaSec) {
      await page.evaluate(() => {
        const el = document.querySelector('[data-testid="sportswear-cta-section"]');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 200));
      const ctaDarkShot = path.join(screenshotsDir, 'prompt05-cta-desktop-refined-dark.png');
      await ctaSec.screenshot({ path: ctaDarkShot });
      console.log(`📸 Saved screenshot: ${ctaDarkShot}`);
    }

    // Toggle Light Theme
    const themeBtn = await page.$('[data-testid="sportswear-theme-toggle"]');
    if (themeBtn) {
      await themeBtn.click();
      await new Promise(r => setTimeout(r, 300));
      if (ctaSec) {
        const ctaLightShot = path.join(screenshotsDir, 'prompt05-cta-desktop-refined-light.png');
        await ctaSec.screenshot({ path: ctaLightShot });
        console.log(`📸 Saved screenshot: ${ctaLightShot}`);
      }
      // Toggle back to dark
      await themeBtn.click();
      await new Promise(r => setTimeout(r, 200));
    }

    // 2. Mobile Verification (390x844)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: 'networkidle0' });

    const mobileCTA = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="sportswear-cta-card"]');
      const content = document.querySelector('.tk-sw-cta-content');
      const waveWrap = document.querySelector('.tk-sw-cta-wave-wrap');
      if (!card || !content || !waveWrap) return null;

      const contentRect = content.getBoundingClientRect();
      const waveRect = waveWrap.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const docWidth = document.documentElement.offsetWidth;
      const scrollWidth = document.documentElement.scrollWidth;

      return {
        isContentAboveWave: contentRect.bottom <= waveRect.top + 15,
        contentTop: contentRect.top,
        waveTop: waveRect.top,
        cardWidth: cardRect.width,
        noOverflow: scrollWidth <= docWidth + 1
      };
    });

    checks.push({
      test: 'CTA Mobile: Text First & Wave Below',
      passed: !!mobileCTA && mobileCTA.isContentAboveWave,
      details: mobileCTA
    });

    checks.push({
      test: 'CTA Mobile: Zero Horizontal Overflow',
      passed: !!mobileCTA && mobileCTA.noOverflow,
      details: mobileCTA
    });

    // Capture Mobile CTA Dark Screenshot
    const ctaMobileSec = await page.$('[data-testid="sportswear-cta-section"]');
    if (ctaMobileSec) {
      await page.evaluate(() => {
        const el = document.querySelector('[data-testid="sportswear-cta-section"]');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 200));
      const ctaMobileShot = path.join(screenshotsDir, 'prompt05-cta-mobile-refined-dark.png');
      await ctaMobileSec.screenshot({ path: ctaMobileShot });
      console.log(`📸 Saved screenshot: ${ctaMobileShot}`);
    }

    // 3. Configurator Navigation Check
    const btn = await page.$('[data-testid="cta-launch-studio-btn"]');
    if (btn) {
      await btn.click();
      await new Promise(r => setTimeout(r, 500));
      const hash = await page.evaluate(() => window.location.hash);
      const studioMounted = await page.evaluate(() => !!document.querySelector('.luxury-studio-stage'));

      checks.push({
        test: 'CTA Launch 3D Studio Opens Existing Configurator (#demo)',
        passed: hash === '#demo' && studioMounted,
        details: { hash, studioMounted }
      });
    }

  } catch (err) {
    console.error('Verification error:', err);
    checks.push({ test: 'Execution', passed: false, details: err.message });
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n========================================');
  console.log('🏁 PROMPT 05 CTA FIX VERIFICATION SUMMARY');
  console.log('========================================');
  let allPassed = true;
  for (const c of checks) {
    const symbol = c.passed ? '✅' : '❌';
    console.log(`${symbol} ${c.test}`);
    if (!c.passed) {
      allPassed = false;
      console.log('   Details:', JSON.stringify(c.details));
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL CTA REFINEMENT CHECKS PASSED!');
    process.exit(0);
  } else {
    console.error('\n❌ SOME CHECKS FAILED!');
    process.exit(1);
  }
}

verify();
