import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const outDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';
const refPath = path.join(outDir, 'ref-configure-confidence.jpg');
const refBase64 = fs.readFileSync(refPath).toString('base64');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#020308;">
        <!-- Left Artwork (x:0 to 365, w:365, h:292) -->
        <canvas id="leftCanvas" width="365" height="292"></canvas>
        <!-- Center Content (x:360 to 615, w:255, h:292) -->
        <canvas id="centerCanvas" width="255" height="292"></canvas>
        <!-- Right Mockup (x:610 to 973, w:363, h:292) -->
        <canvas id="rightCanvas" width="363" height="292"></canvas>
        <img id="refImg" src="data:image/jpeg;base64,${refBase64}" />
      </body>
    </html>
  `);

  await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = document.getElementById('refImg');
      const draw = () => {
        // Left
        const leftCtx = document.getElementById('leftCanvas').getContext('2d');
        leftCtx.drawImage(img, 0, 0, 365, 292, 0, 0, 365, 292);

        // Center
        const centerCtx = document.getElementById('centerCanvas').getContext('2d');
        centerCtx.drawImage(img, 360, 0, 255, 292, 0, 0, 255, 292);

        // Right
        const rightCtx = document.getElementById('rightCanvas').getContext('2d');
        rightCtx.drawImage(img, 610, 0, 363, 292, 0, 0, 363, 292);
        resolve();
      };

      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    });
  });

  const left = await page.$('#leftCanvas');
  await left.screenshot({ path: path.join(outDir, 'ref-left-artwork.png') });

  const center = await page.$('#centerCanvas');
  await center.screenshot({ path: path.join(outDir, 'ref-center-content.png') });

  const right = await page.$('#rightCanvas');
  await right.screenshot({ path: path.join(outDir, 'ref-right-mockup.png') });

  console.log('Successfully extracted ref-left-artwork.png, ref-center-content.png, and ref-right-mockup.png');
  await browser.close();
}

run().catch(console.error);
