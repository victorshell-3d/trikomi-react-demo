import React from 'react';
type P = { size?: number; stroke?: string };
const base = (size: number, stroke: string) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
export const CartIcon = ({ size = 28, stroke = '#fff' }: P) => (<svg {...base(size, stroke)}><path d="M2 3h3l2.5 12h11L21 7H6" /><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /></svg>);
export const ShareIcon = ({ size = 24, stroke = '#fff' }: P) => (<svg {...base(size, stroke)}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8 11l8-5M8 13l8 5" /></svg>);
export const ResetIcon = ({ size = 18, stroke = '#fff' }: P) => (<svg {...base(size, stroke)}><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5" /></svg>);
export const CubeIcon = ({ size = 26 }: P) => (<svg {...base(size, 'currentColor')}><path d="M12 2l9 5v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10" /></svg>);
export const ShirtIcon = ({ size = 26 }: P) => (<svg {...base(size, 'currentColor')}><path d="M8 3l-6 3 2 5 3-1v11h10V10l3 1 2-5-6-3c-1 2-5 2-8 0z" /></svg>);
export const ImageIcon = () => (<svg width="28" height="24" viewBox="0 0 26 22" fill="none" stroke="#fff" strokeWidth="1.6"><rect x="1" y="1" width="24" height="20" rx="2" /><path d="M3 18l7-8 5 5 3-3 6 6" /><circle cx="18" cy="7" r="2" /></svg>);
export const DiamondIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><path d="M12 2l10 10-10 10L2 12z" /><path d="M12 7l5 5-5 5-5-5z" /></svg>);
const f = (d: string) => (<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#dde" strokeWidth="1.4"><path d={d} /></svg>);
export const FeatureIcons = {
  lightweight: f('M6 26C6 12 14 5 27 5c0 13-7 21-19 21M6 26L20 12'),
  breathable: f('M3 10c4-4 8 4 13 0s9 4 13 0M3 17c4-4 8 4 13 0s9 4 13 0M3 24c4-4 8 4 13 0s9 4 13 0'),
  stretch: f('M3 16h26M7 12l-4 4 4 4M25 12l4 4-4 4M9 8c4 3 10 3 14 0M9 24c4-3 10-3 14 0'),
  wicking: (<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#dde" strokeWidth="1.4"><path d="M16 4C11 11 8 15 8 20a8 8 0 0 0 16 0c0-5-3-9-8-16z" /><path d="M12 21a4 4 0 0 0 4 4" /></svg>),
};
