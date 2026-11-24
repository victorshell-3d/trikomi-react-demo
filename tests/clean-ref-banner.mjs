import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795421328017_501184dc.jpg';
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

    const scale = 2; // 2x high resolution
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, w * scale, h * scale);

    // Let's inspect the text regions:
    // Text is located between x: 50*scale and 365*scale, y: 40*scale and 180*scale.
    // In this region:
    // From x = 0 to ~220*scale: background is a smooth dark radial/linear gradient from #040612 to #070B1C.
    // Notice top-left has the glowing cyan arc from x: 0 to 120*scale, y: 0 to 60*scale. DO NOT TOUCH THIS!
    // Bottom-left has the dark curved boundary around y: 190*scale to 228*scale. DO NOT TOUCH THIS!
    
    // In the area: x from 60*scale to 365*scale, y from 40*scale to 180*scale:
    // Let's remove text pixels:
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    // For any bright text pixel in the text bounding box (x: 55*scale to 365*scale, y: 40*scale to 180*scale):
    // If it's the heading ("Let's Build Your 3D Experience Together"):
    // Notice the letters are bright white/light-cyan: r>120, g>120, b>120.
    // The label "READY TO GET STARTED?" is purple: r>90, b>120.
    // The button has bright purple/blue pixels (b>120, r>70, x: 60*scale to 180*scale, y: 135*scale to 175*scale).
    
    // For x from 0 to 360*scale:
    // The background behind the text is dark (luminance < 25).
    // Let's sample the background columns just to the left of the text (e.g. at x: 45*scale) and the bottom (y: 130*scale)
    // and interpolate smoothly.
    // Even better: In 2D, we can perform a harmonic / inpainting interpolation for pixels where lum > 35 or (is button)
    // inside the text box [x: 58*scale .. 362*scale, y: 38*scale .. 178*scale].

    const isTextPixel = (x, y) => {
      if (x < 58 * scale || x > 362 * scale || y < 38 * scale || y > 178 * scale) return false;
      const idx = (y * canvas.width + x) * 4;
      const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // White / grey text
      if (lum > 32) return true;
      // Button violet/blue
      if (b > 75 && (r > 50 || b > g + 25) && x < 185 * scale && y > 130 * scale) return true;
      // Label purple
      if (b > 70 && r > 60 && y < 70 * scale) return true;

      return false;
    };

    // Dilate the mask by 2 pixels to cover anti-aliasing edges
    const mask = new Uint8Array(canvas.width * canvas.height);
    for (let y = 35 * scale; y < 182 * scale; y++) {
      for (let x = 55 * scale; x < 365 * scale; x++) {
        if (isTextPixel(x, y)) {
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              mask[(y + dy) * canvas.width + (x + dx)] = 1;
            }
          }
        }
      }
    }

    // Now inpaint masked pixels using an iterative diffusion / Poisson filter
    // Initialize masked pixels with local dark background
    for (let y = 35 * scale; y < 185 * scale; y++) {
      for (let x = 55 * scale; x < 365 * scale; x++) {
        const idx = (y * canvas.width + x) * 4;
        if (mask[y * canvas.width + x]) {
          // If in wave area (x > 270*scale): blend towards wave dark color
          if (x > 260 * scale) {
            // Sample from top (y: 35*scale) and bottom (y: 182*scale)
            pixels[idx] = 12;
            pixels[idx+1] = 13;
            pixels[idx+2] = 28;
          } else {
            // Dark navy background
            pixels[idx] = 7;
            pixels[idx+1] = 10;
            pixels[idx+2] = 22;
          }
        }
      }
    }

    // Run 30 diffusion iterations for ultra-smooth transition
    for (let iter = 0; iter < 40; iter++) {
      for (let y = 35 * scale; y < 185 * scale; y++) {
        for (let x = 55 * scale; x < 365 * scale; x++) {
          if (mask[y * canvas.width + x]) {
            const idx = (y * canvas.width + x) * 4;
            const topIdx = ((y - 1) * canvas.width + x) * 4;
            const botIdx = ((y + 1) * canvas.width + x) * 4;
            const leftIdx = (y * canvas.width + (x - 1)) * 4;
            const rightIdx = (y * canvas.width + (x + 1)) * 4;

            pixels[idx] = (pixels[topIdx] + pixels[botIdx] + pixels[leftIdx] + pixels[rightIdx]) >> 2;
            pixels[idx+1] = (pixels[topIdx+1] + pixels[botIdx+1] + pixels[leftIdx+1] + pixels[rightIdx+1]) >> 2;
            pixels[idx+2] = (pixels[topIdx+2] + pixels[botIdx+2] + pixels[leftIdx+2] + pixels[rightIdx+2]) >> 2;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    return canvas.toDataURL('image/png');
  });

  const buf = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync(outPath, buf);
  console.log('Saved clean backdrop to', outPath);

  await browser.close();
}

main().catch(console.error);
