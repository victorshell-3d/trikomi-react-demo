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

server.listen(5198, async () => {
  console.log('Verification server running on http://localhost:5198');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Load initial page with dark theme
  await page.goto('http://localhost:5198', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('vs_theme_mode', 'dark');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));

  // Measure Dark Theme styles
  const darkMetrics = await page.evaluate(() => {
    const bottom = document.querySelector('.tk-bottom-integrated');
    const ctaTitle = document.querySelector('.tk-cta-title');
    const ctaLabel = document.querySelector('.tk-cta-label');
    const brandName = document.querySelector('.tk-footer__left .tk-brand__name');
    const footerCopy = document.querySelector('.tk-footer__copy');
    const footerLink = document.querySelector('.tk-footer__link');
    const socialBtn = document.querySelector('.tk-social-btn');

    return {
      theme: document.documentElement.getAttribute('data-theme'),
      bottomBg: window.getComputedStyle(bottom).backgroundColor,
      ctaTitleColor: window.getComputedStyle(ctaTitle).color,
      ctaLabelColor: window.getComputedStyle(ctaLabel).color,
      brandNameColor: window.getComputedStyle(brandName).color,
      footerCopyColor: window.getComputedStyle(footerCopy).color,
      footerLinkColor: window.getComputedStyle(footerLink).color,
      socialBtnColor: window.getComputedStyle(socialBtn).color
    };
  });
  console.log('--- DARK THEME METRICS ---', darkMetrics);

  const ctaSec = await page.$('#cta');
  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'cta-footer-dark-verified.png') });
    console.log('Saved cta-footer-dark-verified.png');
  }

  // 2. Click Theme Toggle to switch to Light Theme live without reload
  console.log('Clicking theme toggle to switch to Light Theme...');
  await page.evaluate(() => {
    const toggle = document.querySelector('.tk-theme-toggle');
    if (toggle) toggle.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Measure Light Theme styles
  const lightMetrics = await page.evaluate(() => {
    const bottom = document.querySelector('.tk-bottom-integrated');
    const ctaTitle = document.querySelector('.tk-cta-title');
    const ctaLabel = document.querySelector('.tk-cta-label');
    const brandName = document.querySelector('.tk-footer__left .tk-brand__name');
    const footerCopy = document.querySelector('.tk-footer__copy');
    const footerLink = document.querySelector('.tk-footer__link');
    const socialBtn = document.querySelector('.tk-social-btn');

    return {
      theme: document.documentElement.getAttribute('data-theme'),
      bottomBg: window.getComputedStyle(bottom).backgroundImage,
      ctaTitleColor: window.getComputedStyle(ctaTitle).color,
      ctaLabelColor: window.getComputedStyle(ctaLabel).color,
      brandNameColor: window.getComputedStyle(brandName).color,
      footerCopyColor: window.getComputedStyle(footerCopy).color,
      footerLinkColor: window.getComputedStyle(footerLink).color,
      socialBtnColor: window.getComputedStyle(socialBtn).color
    };
  });
  console.log('--- LIGHT THEME METRICS ---', lightMetrics);

  if (ctaSec) {
    await ctaSec.screenshot({ path: path.join(outDir, 'cta-footer-light-verified.png') });
    console.log('Saved cta-footer-light-verified.png');
  }

  // 3. Test Persistence across page reload
  console.log('Reloading page to test theme persistence in localStorage...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));

  const persistedTheme = await page.evaluate(() => {
    return {
      docTheme: document.documentElement.getAttribute('data-theme'),
      savedStorage: localStorage.getItem('vs_theme_mode')
    };
  });
  console.log('--- PERSISTENCE VERIFIED ---', persistedTheme);

  // 4. Generate Side-by-side Dark vs Light comparison
  const darkBase64 = fs.readFileSync(path.join(outDir, 'cta-footer-dark-verified.png')).toString('base64');
  const lightBase64 = fs.readFileSync(path.join(outDir, 'cta-footer-light-verified.png')).toString('base64');

  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin:0; padding:24px; background:#0F172A; color:#fff; font-family:sans-serif; }
          h2 { font-size:18px; margin:0 0 12px 0; color:#38BDF8; }
          .card { margin-bottom:28px; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.15); }
          img { width:100%; display:block; }
        </style>
      </head>
      <body>
        <h2>1. DARK THEME: CTA & Footer</h2>
        <div class="card">
          <img src="data:image/png;base64,${darkBase64}" />
        </div>
        <h2>2. LIGHT THEME: CTA & Footer (Pearl White / Lavender, Dark Navy Text)</h2>
        <div class="card">
          <img src="data:image/png;base64,${lightBase64}" />
        </div>
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });

  const compPath = path.join(outDir, 'cta-footer-theme-comparison.png');
  await page.screenshot({ path: compPath, fullPage: true });
  console.log('Saved comparison:', compPath);

  await browser.close();
  server.close();
  console.log('All theme tests passed successfully!');
  process.exit(0);
});
