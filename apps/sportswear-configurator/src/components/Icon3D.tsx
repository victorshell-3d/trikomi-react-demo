import React from 'react';
/** Glossy 3D icon tile: lit gradient body, specular highlight, soft contact shadow, embossed glyph. */
export const Icon3D = ({ children, size = 44, hue = 'violet' }: { children: React.ReactNode; size?: number; hue?: 'violet' | 'cyan' | 'pink' | 'amber' }) => (
  <span className={`i3d ${hue}`} style={{ width: size, height: size }}>
    <span className="i3d-gloss" />
    <svg viewBox="0 0 32 32" width={size * 0.58} height={size * 0.58} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </span>
);
export const G = {
  cube: <><path d="M16 3l11 6v14l-11 6-11-6V9z" /><path d="M5 9l11 6 11-6M16 15v14" /></>,
  shirt: <path d="M11 4L3 8l3 7 4-1.5V28h12V13.5L26 15l3-7-8-4c-1.2 2.6-8.8 2.6-10 0z" />,
  shirtBack: <><path d="M11 4L3 8l3 7 4-1.5V28h12V13.5L26 15l3-7-8-4" /><path d="M11 4c1.2 1.6 8.8 1.6 10 0" /></>,
  shirtSideR: <g transform="translate(32 0) scale(-1 1)"><path d="M13 4l-6 3-3 7 4 2 2-3v14h10V7l-3-3z" /></g>,
  shirtSide: <path d="M13 4l-6 3-3 7 4 2 2-3v14h10V7l-3-3z" />,
  feather: <><path d="M6 27C6 13 14 5 27 5c0 13-7 21-19 21" /><path d="M6 27L20 12" /></>,
  waves: <path d="M3 10c4-4 8 4 13 0s9 4 13 0M3 17c4-4 8 4 13 0s9 4 13 0M3 24c4-4 8 4 13 0s9 4 13 0" />,
  stretch: <><path d="M3 16h26M8 11l-5 5 5 5M24 11l5 5-5 5" /></>,
  drop: <path d="M16 4C11 11 8 15 8 20a8 8 0 0 0 16 0c0-5-3-9-8-16z" />,
  text: <><path d="M6 7h20M16 7v20M11 27h10" /></>,
  image: <><rect x="4" y="5" width="24" height="22" rx="4" /><path d="M6 23l7-8 5 5 3-3 5 6" /><circle cx="21" cy="11" r="2.2" /></>,
  cart: <><path d="M3 5h4l3 15h14l3-11H8" /><circle cx="12" cy="26" r="2" /><circle cx="22" cy="26" r="2" /></>,
  mesh: <><path d="M4 8h24M4 16h24M4 24h24M8 4v24M16 4v24M24 4v24" /><circle cx="16" cy="16" r="3" fill="#fff" stroke="none" /></>,
  knit: <><path d="M4 8l4 4 4-4 4 4 4-4 4 4 4-4M4 16l4 4 4-4 4 4 4-4 4 4 4-4M4 24l4 4 4-4 4 4 4-4 4 4 4-4" /></>,
  smooth: <><path d="M16 3l3.2 9.8L29 16l-9.8 3.2L16 29l-3.2-9.8L3 16l9.8-3.2z" /></>,
  doc: <><path d="M9 3h10l6 6v20H9z" /><path d="M19 3v6h6M13 16h8M13 21h8" /></>,
};
