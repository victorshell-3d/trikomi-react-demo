import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
] .find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795422947294_6449823c.jpg';
const outPath = 'd:/new landing page/trikomi-react-demo/public/images/viewer-cta-exact-backdrop.png';

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

    const scale = 2; // 2x high-resolution rendering
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, w * scale, h * scale);

    // Let's examine the text area in original image coordinates:
    // Label: x=70..195, y=49..60
    // Heading: x=71..362, y=72..138
    // Button: x=65..190, y=140..175
    //
    // Notice that from x=0 to x=250, between y=35 and y=180:
    // The background is pure smooth dark midnight navy (#03050E to #050818).
    // From x=250 to x=370:
    // The background is the front surface of the dark wave rising up!
    // In that wave front (x=250..370, y=70..140):
    // The surface is very dark charcoal/navy (#050714 to #080B1E).
    //
    // Let's clean the text pixels seamlessly:
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const p = imgData.data;

    // Build precise text mask
    const mask = new Uint8Array(canvas.width * canvas.height);
    for (let y = 35 * scale; y < 182 * scale; y++) {
      for (let x = 55 * scale; x < 370 * scale; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = p[idx], g = p[idx+1], b = p[idx+2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Any bright text pixel
        let isText = false;
        if (lum > 26) isText = true;
        // Button purple/blue pixels
        if (x < 195 * scale && y > 136 * scale && (b > 65 || r > 50)) isText = true;
        // Label purple pixels
        if (y < 68 * scale && (b > 60 || r > 50)) isText = true;

        if (isText) {
          // Dilate by 3 pixels to fully cover edge bleed
          for (let dy = -3; dy <= 3; dy++) {
            const ny = y + dy;
            if (ny < 0 || ny >= canvas.height) continue;
            for (let dx = -3; dx <= 3; dx++) {
              const nx = x + dx;
              if (nx < 0 || nx >= canvas.width) continue;
              mask[ny * canvas.width + nx] = 1;
            }
          }
        }
      }
    }

    // Now fill masked pixels smoothly based on coordinate x:
    // For x <= 250*scale: Sample the clean vertical column at x = 46*scale (before any text)
    // where y goes from 35*scale to 182*scale.
    // Notice at x = 46*scale, the background is pristine, zero text!
    // And for x > 250*scale: It smoothly transitions into the dark wave front!
    for (let y = 30 * scale; y < 188 * scale; y++) {
      // Find clean background reference at x = 48*scale
      const cleanIdx = (y * canvas.width + Math.round(48 * scale)) * 4;
      const refR = p[cleanIdx];
      const refG = p[cleanIdx+1];
      const refB = p[cleanIdx+2];

      // Find wave edge background at x = 375*scale (just past the text)
      const waveIdx = (y * canvas.width + Math.round(375 * scale)) * 4;
      const waveR = p[waveIdx];
      const waveG = p[waveIdx+1];
      const waveB = p[waveIdx+2];

      for (let x = 50 * scale; x < 372 * scale; x++) {
        const mIdx = y * canvas.width + x;
        if (mask[mIdx]) {
          const idx = mIdx * 4;
          const t = Math.max(0, Math.min(1, (x - 50 * scale) / (320 * scale)));
          // Smooth easeInOut curve
          const smoothT = t * t * (3 - 2 * t);

          p[idx] = Math.round(refR * (1 - smoothT) + waveR * smoothT);
          p[idx+1] = Math.round(refG * (1 - smoothT) + waveG * smoothT);
          p[idx+2] = Math.round(refB * (1 - smoothT) + waveB * smoothT);
        }
      }
    }

    // Apply 25 iterations of gentle box blur on ONLY the masked region for flawless seamlessness
    for (let iter = 0; iter < 25; iter++) {
      for (let y = 32 * scale; y < 185 * scale; y++) {
        for (let x = 52 * scale; x < 370 * scale; x++) {
          const mIdx = y * canvas.width + x;
          if (mask[mIdx]) {
            const idx = mIdx * 4;
            const topIdx = ((y - 1) * canvas.width + x) * 4;
            const botIdx = ((y + 1) * canvas.width + x) * 4;
            const leftIdx = (y * canvas.width + (x - 1)) * 4;
            const rightIdx = (y * canvas.width + (x + 1)) * 4;

            p[idx] = (p[topIdx] + p[botIdx] + p[leftIdx] + p[rightIdx]) >> 2;
            p[idx+1] = (p[topIdx+1] + p[botIdx+1] + p[leftIdx+1] + p[rightIdx+1]) >> 2;
            p[idx+2] = (p[topIdx+2] + p[botIdx+2] + p[leftIdx+2] + p[rightIdx+2]) >> 2;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  });

  const buf = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync(outPath, buf);
  console.log('Saved flawless backdrop to', outPath);

  // Also save a copy in artifact dir for inspection
  fs.writeFileSync('C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/flawless-backdrop.png', buf);
  console.log('Saved artifact copy');

  await browser.close();
}

main().catch(console.error);
