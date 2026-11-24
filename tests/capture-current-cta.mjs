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

server.listen(5189, async () => {
  console.log('Server running on http://localhost:5189');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

  // 1. Dark Mode 1440x900 Desktop
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5189', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const pageEl = document.querySelector('.tk-viewer-page');
    if (pageEl) pageEl.setAttribute('data-theme', 'dark');
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  const ctaSec = await page.$('#cta');
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'cta-final-dark-1440.png') });
    console.log('Saved cta-final-dark-1440.png');
  }

  const ctaCard = await page.$('.tk-cta-card');
  if (ctaCard) {
    await ctaCard.screenshot({ path: path.join(outDir, 'cta-card-final-1440.png') });
    console.log('Saved cta-card-final-1440.png');
  }

  // 2. Light Mode 1440x900 Desktop
  await page.evaluate(() => {
    const pageEl = document.querySelector('.tk-viewer-page');
    if (pageEl) pageEl.setAttribute('data-theme', 'light');
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'cta-final-light-1440.png') });
    console.log('Saved cta-final-light-1440.png');
  }

  // 3. Desktop 1920x1080
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const pageEl = document.querySelector('.tk-viewer-page');
    if (pageEl) pageEl.setAttribute('data-theme', 'dark');
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'cta-final-dark-1920.png') });
    console.log('Saved cta-final-dark-1920.png');
  }

  // 4. Tablet 768x1024
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'cta-final-tablet-768.png') });
    console.log('Saved cta-final-tablet-768.png');
  }

  // 5. Mobile 390x844
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'cta-final-mobile-390.png') });
    console.log('Saved cta-final-mobile-390.png');
  }

  await browser.close();
  server.close();
  console.log('All verification captures completed!');
});
