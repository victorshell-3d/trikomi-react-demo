import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist');

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
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
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
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(`File not found: ${reqPath}`);
          return;
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

async function checkColors() {
  const port = 4174;
  const server = await startServer(port);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://127.0.0.1:${port}/jewelry-configurator/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.vs-landing-hero', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  const colors = await page.evaluate(() => {
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
      const s = window.getComputedStyle(el);
      return {
        bgHex: rgbToHex(s.backgroundColor),
        bgImg: s.backgroundImage,
        colorHex: rgbToHex(s.color),
        borderHex: rgbToHex(s.borderColor)
      };
    }

    return {
      page: get('.vs-product-landing-page'),
      highlightCard: get('.vs-landing-hero__highlight-item'),
      highlightIcon: get('.vs-landing-hero__highlight-icon'),
      highlightTitle: get('.vs-landing-hero__highlight-title'),
      highlightDesc: get('.vs-landing-hero__highlight-desc'),
      primaryCta: get('.vs-landing-hero__primary-cta'),
      secondaryCta: get('.vs-landing-hero__secondary-cta'),
      customizerCard: get('.vs-jewelry-customizer-card'),
      customizerTabs: get('.vs-jewelry-customizer-tabs'),
      customizerActiveTab: get('.vs-jewelry-tab-btn.is-active'),
      gradientText: get('.vs-gradient-text'),
      rotatePill: get('.vs-jewelry-rotate-pill')
    };
  });

  console.log('COMPUTED_COLORS_JSON_START');
  console.log(JSON.stringify(colors, null, 2));
  console.log('COMPUTED_COLORS_JSON_END');

  await browser.close();
  server.close();
}

checkColors().catch(err => {
  console.error(err);
  process.exit(1);
});
