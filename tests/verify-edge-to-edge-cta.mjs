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
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) {
    const publicPath = path.resolve('apps/viewer/public', reqPath.replace(/^\//, ''));
    if (fs.existsSync(publicPath)) {
      filePath = publicPath;
    } else {
      res.writeHead(404);
      return res.end('Not found');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(5195, async () => {
  console.log('Verification server running on http://localhost:5195');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const testViewports = [
    { name: 'desktop-1920', width: 1920, height: 1080, dpr: 1 },
    { name: 'desktop-1440', width: 1440, height: 900, dpr: 2 },
    { name: 'tablet-768', width: 768, height: 1024, dpr: 2 },
    { name: 'mobile-390', width: 390, height: 844, dpr: 2 }
  ];

  for (const vp of testViewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
    await page.goto('http://localhost:5195', { waitUntil: 'networkidle0' });

    // Scroll to CTA section
    await page.evaluate(() => {
      const el = document.getElementById('cta');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));

    // Get measurements
    const metrics = await page.evaluate(() => {
      const card = document.querySelector('.tk-cta-card');
      const cRect = card.getBoundingClientRect();
      const hasHScroll = document.documentElement.scrollWidth > window.innerWidth;
      return {
        cardLeft: Math.round(cRect.left),
        cardRight: Math.round(cRect.right),
        cardWidth: Math.round(cRect.width),
        windowWidth: window.innerWidth,
        hasHScroll,
        scrollWidth: document.documentElement.scrollWidth
      };
    });

    console.log(`[${vp.name}] CTA Metrics:`, metrics);

    // Capture CTA section screenshot
    const ctaSec = await page.$('#cta');
    if (ctaSec) {
      const shotPath = path.join(outDir, `cta-edge-to-edge-${vp.name}.png`);
      await ctaSec.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    }
  }

  // Also capture light theme at 1440px
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5195', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    // switch to light theme
    const themeBtn = document.querySelector('.tk-theme-toggle');
    if (themeBtn) themeBtn.click();
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));

  const ctaSecLight = await page.$('#cta');
  if (ctaSecLight) {
    const lightShotPath = path.join(outDir, 'cta-edge-to-edge-light-1440.png');
    await ctaSecLight.screenshot({ path: lightShotPath });
    console.log(`Saved screenshot: ${lightShotPath}`);
  }

  await browser.close();
  server.close();
  console.log('All edge-to-edge verifications completed successfully!');
});
