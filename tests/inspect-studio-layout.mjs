import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist');
const artifactDir = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\7fd4a042-0e39-40bf-bc1e-49ce47f84838';

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

function startServer(port = 4195) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
      if (reqPath === '/' || reqPath === '') reqPath = '/viewer/index.html';

      let filePath = path.join(distDir, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        if (reqPath.startsWith('/assets/')) {
          const viewerAsset = path.join(distDir, 'viewer', reqPath);
          if (fs.existsSync(viewerAsset)) filePath = viewerAsset;
        }
      }

      if (!fs.existsSync(filePath)) {
        const publicFallback = path.join(repoRoot, 'public', reqPath);
        if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
          filePath = publicFallback;
        } else {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(port, () => resolve(server));
  });
}

const viewports = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'laptop-1440', width: 1440, height: 900 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 }
];

async function main() {
  const server = await startServer(4195);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl']
  });

  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4195/viewer/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    await page.evaluate(() => {
      const el = document.getElementById('experience');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 600));

    const studio = await page.$('.tk-preview-studio');
    if (studio) {
      const box = await studio.boundingBox();
      const bottombar = await page.$('.tk-studio-bottombar');
      const bottomBox = bottombar ? await bottombar.boundingBox() : null;

      console.log(`Viewport ${vp.name}: Studio box:`, box, `Bottombar box:`, bottomBox);
      const shotPath = path.join(artifactDir, `studio-${vp.name}.png`);
      await studio.screenshot({ path: shotPath });
      console.log(`Saved screenshot to ${shotPath}`);
    }
  }

  await browser.close();
  server.close();
}

main().catch(console.error);
