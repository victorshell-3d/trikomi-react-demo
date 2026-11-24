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

server.listen(5192, async () => {
  console.log('Server running on http://localhost:5192');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

  // 1. Dark Theme Desktop (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5192', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const p = document.querySelector('.tk-viewer-page');
    if (p) p.setAttribute('data-theme', 'dark');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'header-dark-desktop-top.png'), clip: { x: 0, y: 0, width: 1440, height: 400 } });

  // 2. Light Theme Desktop (1440x900)
  await page.evaluate(() => {
    const p = document.querySelector('.tk-viewer-page');
    if (p) p.setAttribute('data-theme', 'light');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'header-light-desktop-top.png'), clip: { x: 0, y: 0, width: 1440, height: 400 } });

  // 3. Mobile Dark Theme (390x844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const p = document.querySelector('.tk-viewer-page');
    if (p) p.setAttribute('data-theme', 'dark');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'header-dark-mobile-top.png'), clip: { x: 0, y: 0, width: 390, height: 350 } });

  // 4. Mobile Light Theme (390x844)
  await page.evaluate(() => {
    const p = document.querySelector('.tk-viewer-page');
    if (p) p.setAttribute('data-theme', 'light');
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'header-light-mobile-top.png'), clip: { x: 0, y: 0, width: 390, height: 350 } });

  // Check computed styles of header
  const headerStyles = await page.evaluate(() => {
    const header = document.querySelector('.tk-navbar');
    if (!header) return null;
    const cs = window.getComputedStyle(header);
    return {
      position: cs.position,
      top: cs.top,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      boxShadow: cs.boxShadow,
      border: cs.border,
      zIndex: cs.zIndex
    };
  });
  console.log('Computed header styles:', headerStyles);

  await browser.close();
  server.close();
  console.log('Done captures!');
});
