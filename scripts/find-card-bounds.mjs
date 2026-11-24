import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const refPath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795250812281_51983b49.jpg';
  const imgBase64 = fs.readFileSync(refPath).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <img id="ref" src="data:image/jpeg;base64,${imgBase64}" />
        <canvas id="canvas"></canvas>
      </body>
    </html>
  `);

  await page.waitForSelector('#ref');

  const targets = [
    { name: 'tour-room-only', sx: 588, sy: 382, sw: 68, sh: 74 },
    { name: 'tour-room-wide', sx: 586, sy: 378, sw: 70, sh: 80 },
    { name: 'pkg-clean', sx: 483, sy: 380, sw: 76, sh: 78 }
  ];

  const artDir = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838';

  for (const t of targets) {
    const dataUrl = await page.evaluate((c) => {
      const img = document.getElementById('ref');
      const canvas = document.getElementById('canvas');
      canvas.width = 360;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, 360, 360);
      return canvas.toDataURL('image/png');
    }, t);

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(path.join(artDir, `${t.name}.png`), Buffer.from(base64Data, 'base64'));
    console.log(`Saved ${t.name}.png`);
  }

  await browser.close();
}

run();
