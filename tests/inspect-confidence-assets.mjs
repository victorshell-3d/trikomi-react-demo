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
  await page.setViewport({ width: 1200, height: 900 });

  const refData = fs.readFileSync(path.join(outDir, 'ref-configure-confidence.jpg')).toString('base64');
  const cleanData = fs.readFileSync(path.resolve('apps/viewer/public/images/viewer-clean-3d-visual.png')).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:20px; background:#020308; color:#fff; font-family:sans-serif;">
        <h2>User Reference (973 x 292):</h2>
        <img id="ref" src="data:image/jpeg;base64,${refData}" style="max-width:100%; border:1px solid #444;" />
        
        <h2>Existing viewer-clean-3d-visual.png (1376 x 768):</h2>
        <img id="clean" src="data:image/jpeg;base64,${cleanData}" style="max-width:600px; border:1px solid #444;" />
      </body>
    </html>
  `);

  await page.screenshot({ path: path.join(outDir, 'confidence-asset-comparison.png'), fullPage: true });
  console.log('Saved confidence-asset-comparison.png');

  await browser.close();
}

run().catch(console.error);
