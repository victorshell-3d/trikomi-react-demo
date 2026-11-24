import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

async function run() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const p1 = path.resolve('public/images/viewer-clean-3d-visual.png');
  const d1 = fs.readFileSync(p1).toString('base64');

  await page.setContent(`
    <html>
      <body style="margin:0; padding:20px; background:#020308; color:#fff;">
        <h2>viewer-clean-3d-visual.png (1376 x 768):</h2>
        <img src="data:image/jpeg;base64,${d1}" style="max-width:800px; border:1px solid #555;" />
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });

  await page.screenshot({ path: path.join(outDir, 'inspect-clean-3d-visual.png'), fullPage: true });
  console.log('Saved inspect-clean-3d-visual.png');
  await browser.close();
  process.exit(0);
}
run();
