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
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.gltf': 'application/json',
  '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm'
};

function startServer(port = 4174) {
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

    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

async function runQA() {
  const port = 4174;
  console.log(`🚀 Starting local server on http://127.0.0.1:${port}...`);
  const server = await startServer(port);

  const tempUserDir = path.join(os.tmpdir(), `puppeteer-qa-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  fs.mkdirSync(tempUserDir, { recursive: true });

  console.log(`🖥️ Launching browser (${chromePath})...`);
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
    pages: {}
  };

  const pagesToTest = [
    {
      name: 'jewelry-configurator',
      url: `http://127.0.0.1:${port}/jewelry-configurator/index.html`,
      titleCheck: 'Jewelry',
      customizerSelector: '.vs-jewelry-customizer-card'
    },
    {
      name: 'sportswear-configurator',
      url: `http://127.0.0.1:${port}/sportswear-configurator/index.html`,
      titleCheck: 'Sportswear',
      customizerSelector: '.vs-sportswear-customizer-card'
    }
  ];

  for (const pageConfig of pagesToTest) {
    console.log(`\n======================================================`);
    console.log(`Testing ${pageConfig.name}...`);
    console.log(`======================================================`);
    const page = await browser.newPage();
    const pageReport = { screenshots: {}, colors: {}, interaction: {} };

    // 1. Desktop Light (1440x900)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(pageConfig.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => { try { localStorage.clear(); } catch {} });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      const loading = document.querySelector('.vs-hero-canvas-loading');
      return !loading;
    }, { timeout: 25000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    const lightPath = path.join(screenshotsDir, `${pageConfig.name}-light-desktop.png`);
    await page.screenshot({ path: lightPath, fullPage: false });
    pageReport.screenshots.lightDesktop = lightPath;
    console.log(`📸 Saved Desktop Light screenshot: ${lightPath}`);

    // Color checks
    pageReport.colors = await page.evaluate((customizerSel) => {
      function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return rgb;
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return rgb;
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
      }

      function get(selector) {
        const el = document.querySelector(selector);
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          color: rgbToHex(cs.color),
          backgroundColor: rgbToHex(cs.backgroundColor),
          borderColor: rgbToHex(cs.borderColor)
        };
      }

      return {
        bodyBg: rgbToHex(window.getComputedStyle(document.body).backgroundColor),
        heroTitle: get('.vs-landing-hero__title'),
        heroLead: get('.vs-landing-hero__lead'),
        ctaPrimary: get('.vs-landing-hero-ctas .vs-landing-hero-cta--primary'),
        ctaSecondary: get('.vs-landing-hero-ctas .vs-landing-hero-cta--secondary'),
        featureCard: get('.vs-landing-features__item'),
        customizer: get(customizerSel)
      };
    }, pageConfig.customizerSelector);

    // Interactive checks
    if (pageConfig.name === 'sportswear-configurator') {
      const tabs = await page.$$('.vs-sportswear-tab-btn');
      const swatches = await page.$$('.vs-sportswear-swatch');
      const patterns = await page.$$('.vs-sportswear-pattern-btn');
      const fabrics = await page.$$('.vs-sportswear-fabric-btn');

      pageReport.interaction.tabCount = tabs.length;
      pageReport.interaction.swatchCount = swatches.length;
      pageReport.interaction.patternCount = patterns.length;
      pageReport.interaction.fabricCount = fabrics.length;

      // Click blue swatch
      if (swatches.length >= 2) {
        await swatches[1].click();
        await new Promise(r => setTimeout(r, 200));
        pageReport.interaction.swatchClicked = true;
      }
    } else if (pageConfig.name === 'jewelry-configurator') {
      const tabs = await page.$$('.vs-jewelry-tab-btn');
      const finishes = await page.$$('.vs-jewelry-swatch');
      const shapes = await page.$$('.vs-jewelry-shape-btn');

      pageReport.interaction.tabCount = tabs.length;
      pageReport.interaction.finishCount = finishes.length;
      pageReport.interaction.shapeCount = shapes.length;
    }

    // 2. Desktop Dark (1440x900)
    const themeToggleBtn = await page.$('[data-testid="landing-theme-mode-toggle"]');
    if (themeToggleBtn) {
      await themeToggleBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }
    const darkPath = path.join(screenshotsDir, `${pageConfig.name}-dark-desktop.png`);
    await page.screenshot({ path: darkPath, fullPage: false });
    pageReport.screenshots.darkDesktop = darkPath;
    console.log(`📸 Saved Desktop Dark screenshot: ${darkPath}`);

    // Reset to light mode
    if (themeToggleBtn) {
      await themeToggleBtn.click();
      await new Promise(r => setTimeout(r, 400));
    }

    // 3. Tablet (768x1024)
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(r => setTimeout(r, 500));
    const tabletPath = path.join(screenshotsDir, `${pageConfig.name}-tablet.png`);
    await page.screenshot({ path: tabletPath, fullPage: false });
    pageReport.screenshots.tablet = tabletPath;
    console.log(`📸 Saved Tablet screenshot: ${tabletPath}`);

    // 4. Mobile (390x844)
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 500));
    const mobilePath = path.join(screenshotsDir, `${pageConfig.name}-mobile.png`);
    await page.screenshot({ path: mobilePath, fullPage: false });
    pageReport.screenshots.mobile = mobilePath;
    console.log(`📸 Saved Mobile screenshot: ${mobilePath}`);

    await page.close();
    report.pages[pageConfig.name] = pageReport;
  }

  await browser.close();
  server.close();

  fs.writeFileSync(
    path.join(repoRoot, 'tests', 'comprehensive-qa-report.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  console.log('\n✅ Comprehensive Visual QA Complete! Report saved to tests/comprehensive-qa-report.json');
}

runQA().catch(err => {
  console.error('QA Script failed:', err);
  process.exit(1);
});
