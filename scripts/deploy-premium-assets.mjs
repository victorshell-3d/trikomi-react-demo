import fs from 'node:fs';
import path from 'node:path';

const artifactDir = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\7fd4a042-0e39-40bf-bc1e-49ce47f84838';
const publicImagesDir = path.resolve('public/images');
const distImagesDir = path.resolve('dist/images');
const publicLogosDir = path.resolve('public/logos');

const assets = [
  {
    src: 'premium_jewelry_hero_1795256318778.jpg',
    targets: [
      'premium-jewelry-hero.jpg',
      'viewer-card-jewelry.png',
      '../logos/jewel.png'
    ]
  },
  {
    src: 'premium_eyewear_hero_1795256381811.jpg',
    targets: [
      'premium-eyewear-hero.jpg',
      'viewer-card-eyewear.png',
      '../logos/eyewear.png'
    ]
  },
  {
    src: 'premium_sportswear_hero_1795256402209.jpg',
    targets: [
      'premium-sportswear-hero.jpg',
      'viewer-card-sportswear.png',
      '../logos/jersey.png'
    ]
  },
  {
    src: 'premium_packaging_hero_1795256433685.jpg',
    targets: [
      'premium-packaging-hero.jpg',
      'viewer-card-packaging.png',
      'box-hero-showcase.png',
      '../logos/box.png'
    ]
  },
  {
    src: 'premium_facemocap_hero_1795256458413.jpg',
    targets: [
      'premium-facemocap-hero.jpg',
      'raccoon-mocap-hero.png',
      '../logos/facemocap.png'
    ]
  },
  {
    src: 'premium_tour_hero_1795256496364.jpg',
    targets: [
      'premium-tour-hero.jpg',
      'viewer-card-tour.png',
      '../logos/360.png'
    ]
  },
  {
    src: 'premium_viewer_hero_1795256539804.jpg',
    targets: [
      'premium-viewer-hero.jpg',
      'viewer-clean-3d-visual.png',
      'viewer-terrain-knot.png',
      'viewer-hero-knot.png'
    ]
  }
];

// Ensure directories exist
[publicImagesDir, distImagesDir, publicLogosDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

for (const item of assets) {
  const srcPath = path.join(artifactDir, item.src);
  if (!fs.existsSync(srcPath)) {
    console.error(`Missing source: ${srcPath}`);
    continue;
  }
  const buf = fs.readFileSync(srcPath);

  for (const targetName of item.targets) {
    if (targetName.startsWith('../logos/')) {
      const logoFile = targetName.replace('../logos/', '');
      fs.writeFileSync(path.join(publicLogosDir, logoFile), buf);
      const distLogoDir = path.resolve('dist/logos');
      if (fs.existsSync(distLogoDir)) {
        fs.writeFileSync(path.join(distLogoDir, logoFile), buf);
      }
      console.log(`Deployed logo: ${logoFile}`);
    } else {
      fs.writeFileSync(path.join(publicImagesDir, targetName), buf);
      fs.writeFileSync(path.join(distImagesDir, targetName), buf);
      console.log(`Deployed image: ${targetName}`);
    }
  }
}

console.log('All premium assets successfully deployed.');
