import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795422947294_6449823c.jpg';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + refImagePath.replace(/\\/g, '/');

  await page.goto(fileUrl);
  await new Promise(r => setTimeout(r, 600));

  const data = await page.evaluate(() => {
    const img = document.querySelector('img');
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, w, h);
    const p = imgData.data;

    // Sample background at (x: 40, y: 100)
    const bgIdx = (100 * w + 40) * 4;
    const bgHex = '#' + [p[bgIdx], p[bgIdx+1], p[bgIdx+2]].map(x => x.toString(16).padStart(2, '0')).join('');

    // Sample top-left arc at (x: 20, y: 30)
    const arcIdx = (30 * w + 20) * 4;
    const arcHex = '#' + [p[arcIdx], p[arcIdx+1], p[arcIdx+2]].map(x => x.toString(16).padStart(2, '0')).join('');

    // Sample lower-left purple curve: trace bright purple pixels in x: 0..300, y: 160..220
    const lowerPoints = [];
    for (let x = 0; x < 350; x += 15) {
      let bestY = -1, maxLum = 0;
      for (let y = 150; y < h; y++) {
        const idx = (y * w + x) * 4;
        const r = p[idx], g = p[idx+1], b = p[idx+2];
        // looking for violet/purple glow (r > 40, b > 60)
        if (b > 50 && r > 30) {
          const lum = r + b;
          if (lum > maxLum) {
            maxLum = lum;
            bestY = y;
          }
        }
      }
      if (bestY > 0 && maxLum > 120) {
        lowerPoints.push({ x, y: bestY, pctX: (x/w*100).toFixed(1)+'%', pctY: (bestY/h*100).toFixed(1)+'%' });
      }
    }

    // Top-left arc points
    const topPoints = [];
    for (let x = 0; x < 150; x += 10) {
      let bestY = -1, maxLum = 0;
      for (let y = 0; y < 80; y++) {
        const idx = (y * w + x) * 4;
        const r = p[idx], g = p[idx+1], b = p[idx+2];
        if (b > 80 && g > 50) { // cyan arc
          const lum = b + g;
          if (lum > maxLum) {
            maxLum = lum;
            bestY = y;
          }
        }
      }
      if (bestY >= 0 && maxLum > 150) {
        topPoints.push({ x, y: bestY, pctX: (x/w*100).toFixed(1)+'%', pctY: (bestY/h*100).toFixed(1)+'%' });
      }
    }

    return {
      w,
      h,
      aspectRatio: (w / h).toFixed(3),
      bgHex,
      arcHex,
      topArcPoints: topPoints,
      lowerPurplePoints: lowerPoints
    };
  });

  console.log('Measurement details:', JSON.stringify(data, null, 2));

  await browser.close();
}

main().catch(console.error);
