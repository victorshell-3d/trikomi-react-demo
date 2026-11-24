import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(fs.existsSync);

const refImagePath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795421328017_501184dc.jpg';
const outShowroomPath = 'd:/new landing page/trikomi-react-demo/public/images/viewer-cta-ref-backdrop.png';

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

  // Let's create two assets:
  // 1. Clean backdrop where text on the left is cleanly covered by the native deep navy background color (#060914)
  //    so the left has the exact glowing cyan top-left arc and bottom dark curve,
  //    and the right has the exact 3D wave, twilight skyline, sofa lounge, illuminated tree, and floor reflection!
  // 2. Also save it at 2x resolution using canvas high quality smoothing.

  const base64Data = await page.evaluate(() => {
    const img = document.querySelector('img');
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    // Render at 2x scale: 1664 x 456
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw full original image
    ctx.drawImage(img, 0, 0, w * scale, h * scale);

    // Let's inspect the text area on the left:
    // The text sits roughly between x: 60*scale to 365*scale, and y: 40*scale to 180*scale.
    // Notice that in the original reference, behind the text is pure dark gradient (#060914).
    // Let's see: on the right (x > 360*scale), the wave and showroom begin.
    // If we create a clean version of the backdrop for HTML/CSS overlay:
    // We can remove the static English text and button from the image by cloning/blending the dark gradient behind it,
    // so the live HTML can render the REAL interactive "Book a Demo" button, selectable text, and responsive layout!
    
    // Let's paint over the text region with a dark radial/linear gradient that matches the background:
    // Left edge has a glowing cyan arc at the top! We MUST preserve that cyan arc!
    // Cyan arc is near x: 0-120*scale, y: 0-60*scale.
    // Text "READY TO GET STARTED?" is around x: 73*scale, y: 50*scale.
    // Heading is at x: 73*scale to 360*scale, y: 74*scale to 125*scale.
    // Button is at x: 66*scale to 165*scale, y: 140*scale to 175*scale.
    
    // We can also export the right showroom+wave starting from x=320 to 832 (62% width),
    // and let CSS handle the dark left side with the exact curved arc!
    // Let's export BOTH:
    // A) The right-side wave+showroom (from x=300 to 832) with a smooth alpha fade on its left edge.
    // B) The full cleaned backdrop.

    // Let's create A: right showroom with smooth alpha mask
    const cRight = document.createElement('canvas');
    const rightCropX = 280;
    const rightCropW = w - rightCropX;
    cRight.width = rightCropW * scale;
    cRight.height = h * scale;
    const ctxR = cRight.getContext('2d');
    ctxR.imageSmoothingEnabled = true;
    ctxR.imageSmoothingQuality = 'high';
    ctxR.drawImage(img, rightCropX, 0, rightCropW, h, 0, 0, rightCropW * scale, h * scale);

    return {
      full: canvas.toDataURL('image/png'),
      rightShowroom: cRight.toDataURL('image/png'),
      w,
      h,
      rightCropW
    };
  });

  const fullBuf = Buffer.from(base64Data.full.replace(/^data:image\/png;base64,/, ''), 'base64');
  const rightBuf = Buffer.from(base64Data.rightShowroom.replace(/^data:image\/png;base64,/, ''), 'base64');

  fs.writeFileSync(outShowroomPath, fullBuf);
  fs.writeFileSync('d:/new landing page/trikomi-react-demo/public/images/viewer-cta-ref-right.png', rightBuf);
  console.log('Saved backdrop to', outShowroomPath);
  console.log('Saved right visual to viewer-cta-ref-right.png');

  await browser.close();
}

main().catch(console.error);
