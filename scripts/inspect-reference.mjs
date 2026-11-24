import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

async function inspect() {
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
      </body>
    </html>
  `);

  const info = await page.evaluate(() => {
    const img = document.getElementById('ref');
    return {
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    };
  });

  console.log('Reference Image Dimensions:', info);
  await browser.close();
}

inspect();
