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
      const distShared = path.resolve('dist', reqPath.replace(/^\//, ''));
      if (fs.existsSync(distShared)) {
        filePath = distShared;
      } else {
        res.writeHead(404);
        return res.end('Not found');
      }
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(5196, async () => {
  console.log('Verification server running on http://localhost:5196');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Desktop Dark 1440px
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5196', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  // Ensure Dark mode is active
  await page.evaluate(() => {
    const pageEl = document.querySelector('.tk-viewer-page');
    if (pageEl && pageEl.getAttribute('data-theme') === 'light') {
      const toggle = document.querySelector('.tk-theme-toggle');
      if (toggle) toggle.click();
    }
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));

  const expSec = await page.$('#experience');
  if (expSec) {
    await expSec.screenshot({ path: path.join(outDir, 'confidence-live-dark-1440.png') });
    console.log('Saved confidence-live-dark-1440.png');
  }

  // 2. Test console hover interaction
  await page.hover('.tk-confidence-console-wrap');
  await new Promise(r => setTimeout(r, 300));
  if (expSec) {
    await expSec.screenshot({ path: path.join(outDir, 'confidence-live-hover.png') });
    console.log('Saved confidence-live-hover.png');
  }

  // 3. Tablet 768px
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  if (expSec) {
    await expSec.screenshot({ path: path.join(outDir, 'confidence-live-tablet-768.png') });
    console.log('Saved confidence-live-tablet-768.png');
  }

  // 4. Mobile 390px
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  if (expSec) {
    await expSec.screenshot({ path: path.join(outDir, 'confidence-live-mobile-390.png') });
    console.log('Saved confidence-live-mobile-390.png');
  }

  // 5. Desktop Light Theme 1440px
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const themeBtn = document.querySelector('.tk-theme-toggle');
    if (themeBtn) themeBtn.click();
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  if (expSec) {
    await expSec.screenshot({ path: path.join(outDir, 'confidence-live-light-1440.png') });
    console.log('Saved confidence-live-light-1440.png');
  }

  // 6. Generate side-by-side comparison HTML & screenshot
  const refBase64 = fs.readFileSync(path.join(outDir, 'ref-configure-confidence.jpg')).toString('base64');
  const liveDarkBase64 = fs.readFileSync(path.join(outDir, 'confidence-live-dark-1440.png')).toString('base64');
  const liveLightBase64 = fs.readFileSync(path.join(outDir, 'confidence-live-light-1440.png')).toString('base64');

  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin:0; padding:28px; background:#020308; color:#fff; font-family:-apple-system,BlinkMacSystemFont,sans-serif; }
          h2 { font-size:16px; font-weight:700; margin:0 0 10px 0; color:#A855F7; text-transform:uppercase; letter-spacing:0.08em; }
          .img-box { margin-bottom:28px; border:1px solid rgba(255,255,255,0.18); border-radius:12px; overflow:hidden; background:#01040A; }
          img { width:100%; display:block; }
          .badge { display:inline-block; padding:4px 10px; border-radius:6px; background:#1E1B4B; color:#C084FC; font-size:12px; font-weight:bold; margin-bottom:8px; }
        </style>
      </head>
      <body>
        <div class="badge">Reference vs Live Verification</div>
        <h2>1. User's Reference Screenshot:</h2>
        <div class="img-box">
          <img src="data:image/jpeg;base64,${refBase64}" />
        </div>
        <h2>2. Live Recreated Section — Dark Theme (Desktop 1440px):</h2>
        <div class="img-box">
          <img src="data:image/png;base64,${liveDarkBase64}" />
        </div>
        <h2>3. Live Recreated Section — Light Theme (Desktop 1440px):</h2>
        <div class="img-box">
          <img src="data:image/png;base64,${liveLightBase64}" />
        </div>
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });

  await page.screenshot({ path: path.join(outDir, 'confidence-live-side-by-side.png'), fullPage: true });
  console.log('Saved confidence-live-side-by-side.png');

  await browser.close();
  server.close();
  console.log('Verification completed successfully!');
  process.exit(0);
});
