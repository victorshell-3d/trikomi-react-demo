import sharp from 'sharp';
import path from 'path';

const refPath = 'C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/.user_uploaded/media_1795422947294_6449823c.jpg';

async function main() {
  const meta = await sharp(refPath).metadata();
  console.log(`Ref dimensions: ${meta.width}x${meta.height}`);

  // Let's crop the left half (0 to 450) and the center (350 to 550) to see them in detail
  await sharp(refPath)
    .extract({ left: 0, top: 0, width: Math.round(meta.width * 0.55), height: meta.height })
    .toFile('C:/Users/lenovo/.gemini/antigravity/brain/7fd4a042-0e39-40bf-bc1e-49ce47f84838/ref-left-55pct.png');

  console.log('Saved ref-left-55pct.png');
}

main().catch(console.error);
