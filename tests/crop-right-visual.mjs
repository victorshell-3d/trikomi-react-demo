import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795421328017_501184dc.jpg';
const outPath1 = 'd:/new landing page/trikomi-react-demo/public/images/viewer-cta-ref-clean-right.png';
const outPath2 = 'd:/new landing page/trikomi-react-demo/apps/viewer/public/images/viewer-cta-ref-clean-right.png';

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

  const base64Data = await page.evaluate(() => {
    const img = document.querySelector('img');
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const scale = 2; // 2x high resolution
    const cropX = 364; // completely beyond "Together"
    const cropW = w - cropX;

    const canvas = document.createElement('canvas');
    canvas.width = cropW * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, cropX, 0, cropW, h, 0, 0, cropW * scale, h * scale);

    return canvas.toDataURL('image/png');
  });

  const buf = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync(outPath1, buf);
  if (!fs.existsSync(path.dirname(outPath2))) {
    fs.mkdirSync(path.dirname(outPath2), { recursive: true });
  }
  fs.writeFileSync(outPath2, buf);
  console.log('Saved clean right visual to:', outPath1, 'and', outPath2);

  await browser.close();
}

main().catch(console.error);
