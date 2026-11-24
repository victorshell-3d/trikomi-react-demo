import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const refBase64 = fs.readFileSync(path.join(outDir, 'ref-configure-confidence.jpg')).toString('base64');
  const liveBase64 = fs.readFileSync(path.join(outDir, 'confidence-left-artwork-verified.png')).toString('base64');

  await page.setViewport({ width: 1300, height: 950, deviceScaleFactor: 2 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin:0; padding:24px; background:#020308; color:#fff; font-family:sans-serif; }
          h2 { font-size:17px; margin:0 0 10px 0; color:#A855F7; }
          .box { margin-bottom:24px; border:1px solid rgba(255,255,255,0.15); border-radius:12px; overflow:hidden; }
          img { width:100%; display:block; }
        </style>
      </head>
      <body>
        <h2>1. User's Reference Screenshot:</h2>
        <div class="box">
          <img src="data:image/jpeg;base64,${refBase64}" />
        </div>
        <h2>2. Live Recreated Section with Verified Left 3D Artwork (HTTP 200):</h2>
        <div class="box">
          <img src="data:image/png;base64,${liveBase64}" />
        </div>
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });

  const finalPath = path.join(outDir, 'confidence-left-artwork-side-by-side.png');
  await page.screenshot({ path: finalPath, fullPage: true });
  console.log('Saved final side-by-side artifact:', finalPath);

  await browser.close();
  process.exit(0);
}

run().catch(console.error);
