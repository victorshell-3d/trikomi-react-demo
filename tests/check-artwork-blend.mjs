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
  const artBase64 = fs.readFileSync(path.join(outDir, 'ref-left-artwork.png')).toString('base64');

  await page.setContent(`
    <html>
      <body style="margin:0; background:#020308;">
        <canvas id="c" width="365" height="292"></canvas>
        <img id="img" src="data:image/png;base64,${artBase64}" />
      </body>
    </html>
  `);

  const rightEdgeColors = await page.evaluate(() => {
    return new Promise((resolve) => {
      const img = document.getElementById('img');
      img.onload = () => {
        const c = document.getElementById('c');
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // sample column at x = 364
        const colors = [];
        for (let y = 0; y < 292; y += 30) {
          const pixel = ctx.getImageData(364, y, 1, 1).data;
          colors.push(`y=${y}: rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
        }
        resolve(colors);
      };
    });
  });

  console.log('Right edge sample colors:', rightEdgeColors);
  await browser.close();
}

run().catch(console.error);
