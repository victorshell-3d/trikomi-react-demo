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
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream'
};

function startServer(port = 4176) {
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
          const publicFallback = path.join(repoRoot, 'public', reqPath);
          if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
            filePath = publicFallback;
          } else {
            res.writeHead(404);
            res.end(`Not found: ${reqPath}`);
            return;
          }
        }
        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Content-Length': stat.size,
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } catch (e) {
        res.writeHead(500);
        res.end(e.message);
      }
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

async function inspectSportswear() {
  const port = 4176;
  const server = await startServer(port);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

  await page.goto(`http://127.0.0.1:${port}/sportswear-configurator/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.vs-landing-hero', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot of hero section
  const heroEl = await page.$('.vs-landing-hero');
  if (heroEl) {
    await heroEl.screenshot({ path: 'public/qa-screenshots/sportswear-hero-diagnose.png' });
    console.log('📸 Hero screenshot saved to public/qa-screenshots/sportswear-hero-diagnose.png');
  }

  // Inspect elements in hero
  const domInfo = await page.evaluate(() => {
    const hero = document.querySelector('.vs-landing-hero');
    const heroVisual = document.querySelector('.vs-landing-hero__visual');
    const stage = document.querySelector('.vs-sportswear-hero-stage');
    const canvas = document.querySelector('.vs-sportswear-hero-stage canvas');
    const svgs = Array.from(document.querySelectorAll('.vs-landing-hero svg')).map(s => ({
      class: s.className.baseVal,
      viewBox: s.getAttribute('viewBox'),
      width: s.clientWidth,
      height: s.clientHeight
    }));
    const images = Array.from(document.querySelectorAll('.vs-landing-hero img')).map(i => ({
      src: i.src,
      width: i.clientWidth,
      height: i.clientHeight
    }));

    return {
      heroRect: hero ? hero.getBoundingClientRect() : null,
      heroVisualRect: heroVisual ? heroVisual.getBoundingClientRect() : null,
      stageRect: stage ? stage.getBoundingClientRect() : null,
      canvasRect: canvas ? canvas.getBoundingClientRect() : null,
      svgs,
      images
    };
  });

  console.log('DOM Info:', JSON.stringify(domInfo, null, 2));
  console.log('Console Logs:', consoleLogs);

  await browser.close();
  server.close();
}

inspectSportswear().catch(console.error);
