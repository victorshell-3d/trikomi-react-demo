import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const distDir = 'd:/new landing page/trikomi-react-demo/dist';
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

function startServer(port = 4199) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
        if (reqPath === '/' || reqPath === '') reqPath = '/viewer/index.html';

        let filePath = path.join(distDir, reqPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
          if (reqPath.startsWith('/assets/')) {
            const viewerAsset = path.join(distDir, 'viewer', reqPath);
            if (fs.existsSync(viewerAsset)) {
              filePath = viewerAsset;
            }
          }
        }

        if (!fs.existsSync(filePath)) {
          const publicFallback = path.join('d:/new landing page/trikomi-react-demo', 'public', reqPath);
          if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
            filePath = publicFallback;
          }
        }

        if (!fs.existsSync(filePath)) {
          res.writeHead(404);
          res.end('Not found: ' + reqPath);
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500);
        res.end(err.message);
      }
    });
    server.listen(port, () => resolve(server));
  });
}

async function main() {
  const port = 4199;
  const server = await startServer(port);
  console.log(`Diagnostic server running on http://localhost:${port}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(`http://localhost:${port}/viewer/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const diag = await page.evaluate(() => {
    const getStyles = (sel, pseudo) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el, pseudo || null);
      return {
        bg: cs.backgroundColor,
        bgImg: cs.backgroundImage,
        boxShadow: cs.boxShadow,
        border: cs.border,
        backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
        position: cs.position,
        zIndex: cs.zIndex,
        top: cs.top,
        height: cs.height,
        opacity: cs.opacity
      };
    };

    return {
      body: getStyles('body'),
      root: getStyles('#root'),
      viewerPage: getStyles('.tk-viewer-page'),
      navbar: getStyles('.tk-navbar'),
      navbarBefore: getStyles('.tk-navbar', '::before'),
      navbarAfter: getStyles('.tk-navbar', '::after'),
      container: getStyles('.tk-navbar .tk-container'),
      inner: getStyles('.tk-navbar__inner'),
      hero: getStyles('.tk-hero'),
      ambient: getStyles('.tk-viewer-ambient')
    };
  });

  console.log('--- COMPUTED STYLES DIAGNOSTIC ---');
  console.log(JSON.stringify(diag, null, 2));

  // Take screenshot of top of page in Light mode
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/diag-light-hero-navbar.png', fullPage: false });

  // Switch to Dark mode
  const toggle = await page.$('.tk-theme-toggle');
  if (toggle) {
    await toggle.click();
    await new Promise(r => setTimeout(r, 600));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/diag-dark-hero-navbar.png', fullPage: false });
  }

  await browser.close();
  server.close();
  console.log('Diagnostic finished.');
}

main().catch(console.error);
