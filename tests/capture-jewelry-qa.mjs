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

async function capture() {
  console.log('🚀 Starting Test Server on 4174...');
  const port = 4174;
  const server = await startServer(port);

  console.log('🖥️ Launching Chrome...');
  const tempUserDir = path.join(os.tmpdir(), `puppeteer-jqa-${Date.now()}`);
  fs.mkdirSync(tempUserDir, { recursive: true });

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

  const page = await browser.newPage();
  const url = `http://127.0.0.1:${port}/jewelry-configurator/index.html`;

  // 1. Desktop Light (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const lightPath = path.join(screenshotsDir, 'jewelry-configurator-light-desktop.png');
  await page.screenshot({ path: lightPath, fullPage: false });
  console.log(`📸 Saved Desktop Light screenshot: ${lightPath}`);

  // 2. Desktop Dark (1440x900)
  const themeToggleBtn = await page.$('[data-testid="landing-theme-mode-toggle"]');
  if (themeToggleBtn) {
    await themeToggleBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }
  const darkPath = path.join(screenshotsDir, 'jewelry-configurator-dark-desktop.png');
  await page.screenshot({ path: darkPath, fullPage: false });
  console.log(`📸 Saved Desktop Dark screenshot: ${darkPath}`);

  // Reset to light mode
  if (themeToggleBtn) {
    await themeToggleBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. Tablet (768x1024)
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(r => setTimeout(r, 500));
  const tabletPath = path.join(screenshotsDir, 'jewelry-configurator-tablet.png');
  await page.screenshot({ path: tabletPath, fullPage: false });
  console.log(`📸 Saved Tablet screenshot: ${tabletPath}`);

  // 4. Mobile (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 500));
  const mobilePath = path.join(screenshotsDir, 'jewelry-configurator-mobile.png');
  await page.screenshot({ path: mobilePath, fullPage: false });
  console.log(`📸 Saved Mobile screenshot: ${mobilePath}`);

  await browser.close();
  server.close();
  console.log('✅ Capture complete!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
