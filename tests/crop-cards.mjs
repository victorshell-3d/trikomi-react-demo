import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

async function run() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' });
  const page = await browser.newPage();
  const refPath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795250812281_51983b49.jpg';
  const imgBase64 = fs.readFileSync(refPath).toString('base64');
  await page.setContent(`<html><body style="margin:0"><img id="img" src="data:image/jpeg;base64,${imgBase64}"/><canvas id="c"></canvas></body></html>`);
  
  const dataUrl = await page.evaluate(() => {
    const img = document.getElementById('img');
    const c = document.getElementById('c');
    const w = img.naturalWidth;
    const sy = Math.round(img.naturalHeight * 0.33);
    const sh = Math.round(img.naturalHeight * 0.18);
    c.width = w;
    c.height = sh;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, sy, w, sh, 0, 0, w, sh);
    return c.toDataURL('image/png');
  });

  const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
  fs.writeFileSync('C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/ref-cards-row.png', buf);
  console.log('Saved ref-cards-row.png successfully!');
  await browser.close();
}

run();
