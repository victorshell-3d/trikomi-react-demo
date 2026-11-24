import fs from 'node:fs';

export function generateSportswearSvg(options = {}) {
  const {
    baseColor = '#FFFFFF',
    accentColor = '#7628D9',
    secondaryColor = '#B23DEB',
    darkAccent = '#581C87',
    number = '10',
    pattern = 'sash'
  } = options;

  let patternMarkup = '';
  if (pattern === 'sash') {
    // Exact dynamic diagonal purple lightning / sash stripes from reference image
    patternMarkup = `
      <!-- Main Dynamic Diagonal Sash across Front Torso -->
      <polygon points="137,1350 420,608 550,608 137,1120" fill="${accentColor}" />
      <polygon points="137,1100 560,608 610,608 137,980" fill="${secondaryColor}" opacity="0.85" />
      <polygon points="137,960 610,650 640,680 137,860" fill="${darkAccent}" opacity="0.9" />
      <polygon points="320,1400 680,820 749,880 430,1400" fill="${accentColor}" opacity="0.9" />
      <polygon points="450,1400 710,950 749,990 520,1400" fill="${secondaryColor}" opacity="0.75" />

      <!-- Matching Sash on Back Torso -->
      <polygon points="784,1350 1067,608 1197,608 784,1120" fill="${accentColor}" opacity="0.95" />
      <polygon points="784,1100 1207,608 1257,608 784,980" fill="${secondaryColor}" opacity="0.85" />
      <polygon points="967,1400 1327,820 1396,880 1077,1400" fill="${accentColor}" opacity="0.9" />
    `;
  } else if (pattern === 'waves') {
    patternMarkup = `
      <!-- Flowing Aerodynamic Wave Stripes -->
      <path d="M 137,900 Q 350,750 749,950 L 749,1100 Q 350,900 137,1050 Z" fill="${accentColor}" />
      <path d="M 137,1120 Q 350,970 749,1170 L 749,1270 Q 350,1070 137,1220 Z" fill="${secondaryColor}" opacity="0.85" />
      <path d="M 784,900 Q 997,750 1396,950 L 1396,1100 Q 997,900 784,1050 Z" fill="${accentColor}" />
    `;
  } else if (pattern === 'dots') {
    patternMarkup = `
      <!-- Perforated Dot Matrix -->
      <defs>
        <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="4" fill="${accentColor}" opacity="0.7" />
        </pattern>
      </defs>
      <rect x="137" y="750" width="612" height="400" fill="url(#dotPattern)" />
      <rect x="784" y="750" width="612" height="400" fill="url(#dotPattern)" />
    `;
  } else if (pattern === 'hex') {
    patternMarkup = `
      <!-- Honeycomb Hexagonal Tech Pattern -->
      <defs>
        <pattern id="hexPattern" width="24" height="41.56" patternUnits="userSpaceOnUse">
          <path d="M12 0 L24 6.92 L24 20.78 L12 27.7 L0 20.78 L0 6.92 Z" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.5" />
          <path d="M12 41.56 L24 34.64 L24 20.78 L12 27.7 L0 20.78 L0 34.64 Z" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="137" y="720" width="612" height="450" fill="url(#hexPattern)" />
      <rect x="784" y="720" width="612" height="450" fill="url(#hexPattern)" />
    `;
  } else if (pattern === 'chevron') {
    patternMarkup = `
      <!-- Athletic Chevron Arrow Stripes -->
      <polygon points="137,850 443,720 749,850 749,940 443,810 137,940" fill="${accentColor}" />
      <polygon points="137,980 443,850 749,980 749,1070 443,940 137,1070" fill="${secondaryColor}" opacity="0.85" />
      <polygon points="784,850 1090,720 1396,850 1396,940 1090,810 784,940" fill="${accentColor}" />
    `;
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 1533.1 1533.1">
  <defs>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6420C8" />
      <stop offset="100%" stop-color="#B23DEB" />
    </linearGradient>
  </defs>

  <!-- Front Torso Panel (x:137, y:608.6, w:612, h:792) -->
  <rect x="137" y="608.6" width="612" height="792" fill="${baseColor}" />

  <!-- Back Torso Panel (x:784.1, y:608.6, w:612, h:792) -->
  <rect x="784.1" y="608.6" width="612" height="792" fill="${baseColor}" />

  <!-- Dynamic Graphic Pattern -->
  ${patternMarkup}

  <!-- Left Sleeve (x:76.9, y:55.2, w:513.4, h:334.9) -->
  <rect x="76.9" y="55.2" width="513.4" height="334.9" fill="${baseColor}" />
  <!-- Left Sleeve Dynamic Stripe -->
  <polygon points="76.9,180 280,55.2 380,55.2 76.9,260" fill="${accentColor}" />
  <!-- Left Sleeve Cuff Trim -->
  <rect x="76.9" y="394.6" width="513.4" height="117.1" fill="${accentColor}" />

  <!-- Right Sleeve (x:603.5, y:55.2, w:513.4, h:334.9) -->
  <rect x="603.5" y="55.2" width="513.4" height="334.9" fill="${baseColor}" />
  <!-- Right Sleeve Dynamic Stripe -->
  <polygon points="603.5,180 806,55.2 906,55.2 603.5,260" fill="${accentColor}" />
  <!-- Right Sleeve Cuff Trim -->
  <rect x="603.5" y="394.6" width="513.4" height="117.1" fill="${accentColor}" />

  <!-- Collar Bands (x:1132.1, y:26.8 and x:1301.2, y:26.8) -->
  <rect x="1132.1" y="26.8" width="168.5" height="513.4" fill="${accentColor}" />
  <rect x="1301.2" y="26.8" width="94.2" height="513.4" fill="${secondaryColor}" />

  <!-- Waist Trims (Bottom) -->
  <rect x="137" y="1400" width="612" height="60" fill="${accentColor}" />
  <rect x="784.1" y="1400" width="612" height="60" fill="${accentColor}" />

  <!-- VictorShell Logo on Chest (Wearer Left / Viewer Right: around x:550, y:720) -->
  <g transform="translate(520, 690) scale(0.65)">
    <!-- 3D Cube Icon -->
    <polygon points="20,5 35,14 20,23 5,14" fill="${secondaryColor}" />
    <polygon points="5,14 20,23 20,38 5,29" fill="${accentColor}" />
    <polygon points="35,14 20,23 20,38 35,29" fill="${darkAccent}" />
    <!-- Brand Text -->
    <text x="45" y="26" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" fill="${darkAccent}" letter-spacing="0.5">VictorShell<tspan font-size="9" dy="-6">TM</tspan></text>
  </g>

  <!-- Number "10" on Center Front Chest (around x:443, y:860) -->
  <text x="443" y="865" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-weight="900" font-size="115" fill="${darkAccent}" text-anchor="middle" letter-spacing="-2">${number}</text>

  <!-- Back Player Name & Number -->
  <text x="1090" y="780" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="42" fill="${darkAccent}" text-anchor="middle" letter-spacing="4">VICTOR</text>
  <text x="1090" y="930" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-weight="900" font-size="140" fill="${darkAccent}" text-anchor="middle" letter-spacing="-3">${number}</text>
</svg>`;
}

const svgContent = generateSportswearSvg();
fs.writeFileSync('public/textures/SportswearJersey_VictorShell.svg', svgContent, 'utf-8');
console.log('Successfully created public/textures/SportswearJersey_VictorShell.svg');
