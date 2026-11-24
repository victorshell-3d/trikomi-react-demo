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
    const publicPath = path.resolve('public', reqPath.replace(/^\//, ''));
    if (fs.existsSync(publicPath)) {
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

server.listen(5197, async () => {
  console.log('Verification server running on http://localhost:5197');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Track network responses for image assets
  const networkLogs = [];
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/images/')) {
      networkLogs.push({ url, status: response.status() });
    }
  });

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5197', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Check left artwork image element metrics in browser DOM
  const imageStatus = await page.evaluate(() => {
    const img = document.querySelector('.tk-confidence-artwork');
    if (!img) return { found: false };
    return {
      found: true,
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
      complete: img.complete,
      displayedCorrectly: img.naturalWidth > 0 && img.complete
    };
  });

  console.log('Left Artwork DOM Status:', imageStatus);
  console.log('Image Network Responses:', networkLogs);

  // Capture screenshot of section
  const expSec = await page.$('#experience');
  if (expSec) {
    const shotPath = path.join(outDir, 'confidence-left-artwork-verified.png');
    await expSec.screenshot({ path: shotPath });
    console.log('Saved screenshot:', shotPath);
  }

  // Also capture light theme
  await page.evaluate(() => {
    const themeBtn = document.querySelector('.tk-theme-toggle');
    if (themeBtn) themeBtn.click();
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  if (expSec) {
    const lightPath = path.join(outDir, 'confidence-left-artwork-light.png');
    await expSec.screenshot({ path: lightPath });
    console.log('Saved light theme screenshot:', lightPath);
  }

  await browser.close();
  server.close();
  console.log('All image checks and captures completed successfully!');
  process.exit(0);
});
