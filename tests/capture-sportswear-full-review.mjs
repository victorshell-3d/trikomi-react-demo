import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const repoRoot = path.resolve('.');
const distDir = path.join(repoRoot, 'dist', 'sportswear-configurator');
const screenshotsDir = path.join(repoRoot, 'public', 'qa-screenshots');

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

function startServer(port = 4198) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
        if (reqPath === '/' || reqPath === '/sportswear-configurator/') reqPath = '/index.html';
        if (reqPath.startsWith('/sportswear-configurator/')) {
          reqPath = reqPath.replace('/sportswear-configurator/', '/');
        }

        let filePath = path.join(distDir, reqPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
          const publicFallback = path.join(repoRoot, 'public', reqPath);
          if (fs.existsSync(publicFallback) && !fs.statSync(publicFallback).isDirectory()) {
            filePath = publicFallback;
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
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

async function capture() {
  const port = 4198;
  const server = await startServer(port);
  console.log(`Server started on http://127.0.0.1:${port}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  // Wait for all images to be fully loaded
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = img.onerror = resolve;
        setTimeout(resolve, 3000);
      });
    }));
  });

  // Capture Full Page
  const fullPagePath = path.join(screenshotsDir, 'sportswear-full-page-dark.png');
  await page.screenshot({ path: fullPagePath, fullPage: true });
  console.log(`Saved full page: ${fullPagePath}`);

  // Capture Section 4 & 5 (Capabilities & Studio) together
  const capSec = await page.$('[data-testid="sportswear-capabilities-section"]');
  const studioSec = await page.$('[data-testid="sportswear-showcase-section"]');
  if (capSec && studioSec) {
    const capBox = await capSec.boundingBox();
    const studioBox = await studioSec.boundingBox();
    const combinedY = Math.min(capBox.y, studioBox.y);
    const combinedHeight = Math.max(capBox.y + capBox.height, studioBox.y + studioBox.height) - combinedY;

    const middleSectionsPath = path.join(screenshotsDir, 'sportswear-middle-sections-dark.png');
    await page.screenshot({
      path: middleSectionsPath,
      clip: {
        x: 0,
        y: combinedY,
        width: 1440,
        height: combinedHeight
      }
    });
    console.log(`Saved middle sections: ${middleSectionsPath}`);
  }

  // Capture Section 4 (Capabilities)
  if (capSec) {
    const capPath = path.join(screenshotsDir, 'sportswear-capabilities-dark.png');
    await capSec.screenshot({ path: capPath });
    console.log(`Saved capabilities section: ${capPath}`);
  }

  // Capture Section 5 (Studio)
  if (studioSec) {
    const studioPath = path.join(screenshotsDir, 'sportswear-studio-dark.png');
    await studioSec.screenshot({ path: studioPath });
    console.log(`Saved studio section: ${studioPath}`);
  }

  // Capture Section 6 & 7 (CTA & Footer)
  const ctaSec = await page.$('[data-testid="sportswear-cta-section"]');
  const footerSec = await page.$('[data-testid="sportswear-footer"]');
  if (ctaSec && footerSec) {
    const ctaBox = await ctaSec.boundingBox();
    const footerBox = await footerSec.boundingBox();
    const combinedY = Math.min(ctaBox.y, footerBox.y);
    const combinedHeight = Math.max(ctaBox.y + ctaBox.height, footerBox.y + footerBox.height) - combinedY;

    const bottomSectionsPath = path.join(screenshotsDir, 'sportswear-bottom-sections-dark.png');
    await page.screenshot({
      path: bottomSectionsPath,
      clip: {
        x: 0,
        y: combinedY,
        width: 1440,
        height: combinedHeight
      }
    });
    console.log(`Saved bottom sections: ${bottomSectionsPath}`);
  }

  await browser.close();
  server.close();
  console.log('Capture complete!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
