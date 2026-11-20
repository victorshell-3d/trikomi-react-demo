/**
 * VictorShell Sportswear Jersey SVG Texture Generator
 * Procedurally generates high-resolution texture map conforming to SoccerJersey.gltf UV coordinates.
 * Matches the approved reference image with purple and white dynamic sash, number 10, collar trim,
 * sleeve cuffs, and VictorShell brand mark.
 */

export interface SportswearTextureOptions {
  baseColor?: string;
  colorName?: string;
  pattern?: string;
  number?: string;
  fabric?: string;
}

const COLOR_PALETTES: Record<string, { accent: string; secondary: string; dark: string; base: string }> = {
  purple: {
    accent: '#7628D9',
    secondary: '#B23DEB',
    dark: '#581C87',
    base: '#FFFFFF'
  },
  blue: {
    accent: '#2563EB',
    secondary: '#60A5FA',
    dark: '#1E3A8A',
    base: '#FFFFFF'
  },
  red: {
    accent: '#DC2626',
    secondary: '#F87171',
    dark: '#991B1B',
    base: '#FFFFFF'
  },
  orange: {
    accent: '#EA580C',
    secondary: '#FB923C',
    dark: '#9A3412',
    base: '#FFFFFF'
  },
  white: {
    accent: '#64748B',
    secondary: '#CBD5E1',
    dark: '#1E293B',
    base: '#F8FAFC'
  }
};

export function generateSportswearJerseySvg(options: SportswearTextureOptions = {}): string {
  const colorKey = (options.colorName || 'purple').toLowerCase();
  const palette = COLOR_PALETTES[colorKey] || COLOR_PALETTES.purple;
  const baseColor = options.baseColor || palette.base;
  const accentColor = palette.accent;
  const secondaryColor = palette.secondary;
  const darkAccent = palette.dark;
  const pattern = (options.pattern || 'sash').toLowerCase();
  const number = options.number || '10';

  let patternMarkup = '';

  if (pattern === 'sash') {
    // Dynamic purple diagonal lightning/sash stripes across lower torso & waist (y: 220-480)
    // Leaves upper chest (y: 500-740) clean white for VictorShell logo and number 10
    patternMarkup = `
      <!-- Dynamic Diagonal Sash across Lower Front Torso -->
      <polygon points="137,480 440,240 560,240 137,420" fill="${accentColor}" />
      <polygon points="137,400 560,240 620,240 137,350" fill="${secondaryColor}" opacity="0.9" />
      <polygon points="340,480 680,260 749,260 480,480" fill="${accentColor}" opacity="0.92" />
      <polygon points="460,480 710,300 749,300 560,480" fill="${secondaryColor}" opacity="0.85" />
      <polygon points="560,480 740,340 749,340 640,480" fill="${accentColor}" opacity="0.88" />

      <!-- Matching Dynamic Sash on Back Torso -->
      <polygon points="784,480 1087,240 1207,240 784,420" fill="${accentColor}" />
      <polygon points="784,400 1207,240 1267,240 784,350" fill="${secondaryColor}" opacity="0.9" />
      <polygon points="987,480 1327,260 1396,260 1127,480" fill="${accentColor}" opacity="0.92" />
    `;
  } else if (pattern === 'waves') {
    patternMarkup = `
      <!-- Flowing Aerodynamic Wave Stripes across Lower Torso -->
      <path d="M 137,380 Q 440,280 749,400 L 749,460 Q 440,340 137,440 Z" fill="${accentColor}" />
      <path d="M 137,430 Q 440,330 749,450 L 749,480 Q 440,380 137,470 Z" fill="${secondaryColor}" opacity="0.85" />
      <path d="M 784,380 Q 1087,280 1396,400 L 1396,460 Q 1087,340 784,440 Z" fill="${accentColor}" />
      <path d="M 784,430 Q 1087,330 1396,450 L 1396,480 Q 1087,380 784,470 Z" fill="${secondaryColor}" opacity="0.85" />
    `;
  } else if (pattern === 'dots') {
    patternMarkup = `
      <!-- Perforated Dot Matrix -->
      <defs>
        <pattern id="dotPattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="5" fill="${accentColor}" opacity="0.75" />
        </pattern>
      </defs>
      <rect x="137" y="240" width="612" height="240" fill="url(#dotPattern)" />
      <rect x="784" y="240" width="612" height="240" fill="url(#dotPattern)" />
    `;
  } else if (pattern === 'hex') {
    patternMarkup = `
      <!-- Honeycomb Hexagonal Tech Pattern -->
      <defs>
        <pattern id="hexPattern" width="30" height="51.96" patternUnits="userSpaceOnUse">
          <path d="M15 0 L30 8.66 L30 25.98 L15 34.64 L0 25.98 L0 8.66 Z" fill="none" stroke="${accentColor}" stroke-width="2.5" opacity="0.6" />
          <path d="M15 51.96 L30 43.3 L30 25.98 L15 34.64 L0 25.98 L0 43.3 Z" fill="none" stroke="${accentColor}" stroke-width="2.5" opacity="0.6" />
        </pattern>
      </defs>
      <rect x="137" y="240" width="612" height="240" fill="url(#hexPattern)" />
      <rect x="784" y="240" width="612" height="240" fill="url(#hexPattern)" />
    `;
  } else if (pattern === 'chevron') {
    patternMarkup = `
      <!-- Athletic Chevron Arrow Stripes -->
      <polygon points="137,380 443,300 749,380 749,440 443,360 137,440" fill="${accentColor}" />
      <polygon points="137,440 443,360 749,440 749,480 443,400 137,480" fill="${secondaryColor}" opacity="0.88" />
      <polygon points="784,380 1090,300 1396,380 1396,440 1090,360 784,440" fill="${accentColor}" />
      <polygon points="784,440 1090,360 1396,440 1396,480 1090,400 784,480" fill="${secondaryColor}" opacity="0.88" />
    `;
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 1533.1 1533.1">
  <!-- Full-Canvas Solid Base Fill: Eliminates all transparent seams/gaps across entire 3D model -->
  <rect width="1533.1" height="1533.1" fill="${baseColor}" />

  <!-- Front Torso Panel Base (x: 137, y: 608.6, w: 612, h: 792) -->
  <rect x="137" y="608.6" width="612" height="792" fill="${baseColor}" />
  <!-- Back Torso Panel Base (x: 784.1, y: 608.6, w: 612, h: 792) -->
  <rect x="784.1" y="608.6" width="612" height="792" fill="${baseColor}" />

  <!-- Dynamic Graphic Pattern (Lower Torso y: 220-480) -->
  ${patternMarkup}

  <!-- Sleeve Dynamic Stripes -->
  <polygon points="76.9,180 280,55.2 380,55.2 76.9,260" fill="${accentColor}" />
  <!-- Left Sleeve Cuff Trim -->
  <rect x="76.9" y="394.6" width="513.4" height="117.1" fill="${accentColor}" />

  <!-- Right Sleeve Dynamic Stripe -->
  <polygon points="603.5,180 806,55.2 906,55.2 603.5,260" fill="${accentColor}" />
  <!-- Right Sleeve Cuff Trim -->
  <rect x="603.5" y="394.6" width="513.4" height="117.1" fill="${accentColor}" />

  <!-- Collar Bands -->
  <rect x="1132.1" y="26.8" width="168.5" height="513.4" fill="${accentColor}" />
  <rect x="1301.2" y="26.8" width="94.2" height="513.4" fill="${secondaryColor}" />

  <!-- VictorShell Logo on Center Upper Chest -->
  <g transform="translate(443, 680)">
    <!-- 3D Cube Icon -->
    <polygon points="0,-16 14,-8 0,0 -14,-8" fill="${secondaryColor}" />
    <polygon points="-14,-8 0,0 0,16 -14,8" fill="${accentColor}" />
    <polygon points="14,-8 0,0 0,16 14,8" fill="${darkAccent}" />
    <!-- Brand Text -->
    <text x="0" y="30" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="16" fill="${darkAccent}" text-anchor="middle" letter-spacing="0.5">VictorShell<tspan font-size="9" dy="-5">TM</tspan></text>
  </g>

  <!-- Number "10" on Center Front Chest -->
  <text x="443" y="560" font-family="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" font-weight="900" font-size="124" fill="${darkAccent}" text-anchor="middle" letter-spacing="-2">${number}</text>

  <!-- Back Player Name & Number (Centered on Back Panel x: 784-1396) -->
  <text x="1090" y="680" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="42" fill="${darkAccent}" text-anchor="middle" letter-spacing="4">VICTOR</text>
  <text x="1090" y="560" font-family="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" font-weight="900" font-size="140" fill="${darkAccent}" text-anchor="middle" letter-spacing="-3">${number}</text>
</svg>`;
}
