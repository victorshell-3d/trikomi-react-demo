import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const distDir = path.resolve('dist/viewer');

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

server.listen(5194, async () => {
  console.log('Server running on http://localhost:5194');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5194', { waitUntil: 'networkidle0' });

  // Apply full-bleed CSS
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'full-bleed-cta-test';
    style.innerHTML = `
      .tk-cta-card {
        width: 100vw !important;
        max-width: none !important;
        margin-left: calc(50% - 50vw) !important;
        margin-right: calc(50% - 50vw) !important;
        box-sizing: border-box !important;
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
        border-top: 1px solid rgba(0, 229, 255, 0.35) !important;
        border-bottom: 1px solid rgba(0, 229, 255, 0.2) !important;
      }
      .tk-bottom-integrated {
        overflow: hidden !important;
        padding-top: 0 !important;
      }
    `;
    document.head.appendChild(style);

    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });

  await new Promise(r => setTimeout(r, 600));

  // Measure card geometry and horizontal scrollbar
  const measurements = await page.evaluate(() => {
    const card = document.querySelector('.tk-cta-card');
    const cRect = card.getBoundingClientRect();
    const hasHScroll = document.documentElement.scrollWidth > window.innerWidth;
    return {
      cardLeft: cRect.left,
      cardRight: cRect.right,
      cardWidth: cRect.width,
      windowWidth: window.innerWidth,
      hasHScroll,
      scrollWidth: document.documentElement.scrollWidth
    };
  });
  console.log('Measurements with 100vw:', measurements);

  // Capture Option A: standard 7.5% padding
  const ctaSec = await page.$('#cta');
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'full-bleed-optA-7pct.png') });
    console.log('Saved full-bleed-optA-7pct.png');
  }

  // Option B: padding matching container alignment
  await page.evaluate(() => {
    const cardContent = document.querySelector('.tk-cta-content');
    if (cardContent) {
      cardContent.style.paddingLeft = 'max(32px, calc((100vw - 1240px) / 2 + 24px + 85px))';
    }
  });
  await new Promise(r => setTimeout(r, 300));
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'full-bleed-optB-container-aligned.png') });
    console.log('Saved full-bleed-optB-container-aligned.png');
  }

  // 1920 viewport test
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 300));
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'full-bleed-1920.png') });
    console.log('Saved full-bleed-1920.png');
  }

  await browser.close();
  server.close();
});
