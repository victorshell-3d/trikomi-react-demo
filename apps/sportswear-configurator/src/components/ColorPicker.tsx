import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useConfigStore } from '../store/ConfiguratorStore';

const hexToRgb = (h: string) => { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0;
  if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return [h, mx ? d / mx : 0, mx];
};
const hsvToHex = (h: number, s: number, v: number) => {
  const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return rgbToHex(f(5) * 255, f(3) * 255, f(1) * 255);
};

/** One shared colour picker: saturation/brightness area, hue bar and hex field. */
export const ColorPicker: React.FC<{ value: string; onChange: (hex: string) => void }> = ({ value, onChange }) => {
  const [hsv, setHsv] = useState<number[]>(() => rgbToHsv(...(hexToRgb(value) as [number, number, number])));
  const [hex, setHex] = useState(value);
  const last = useRef(value.toLowerCase());
  // follow outside changes (tab switch) without losing hue on greys
  useEffect(() => {
    if (value.toLowerCase() !== last.current) {
      last.current = value.toLowerCase();
      const n = rgbToHsv(...(hexToRgb(value) as [number, number, number]));
      setHsv(h => [n[1] === 0 || n[2] === 0 ? h[0] : n[0], n[1], n[2]]);
      setHex(value);
    }
  }, [value]);
  const push = (h: number, s: number, v: number) => {
    setHsv([h, s, v]); const x = hsvToHex(h, s, v); setHex(x); last.current = x.toLowerCase(); onChange(x);
  };
  const drag = (el: HTMLElement, cb: (fx: number, fy: number) => void) => (e: React.PointerEvent) => {
    e.preventDefault(); el.setPointerCapture?.(e.pointerId);
    const move = (ev: PointerEvent) => { const r = el.getBoundingClientRect(); cb(Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height))); };
    move(e.nativeEvent);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };
  const [h, s, v] = hsv;
  return (
    <div className="cp" data-testid="color-picker">
      <div className="cp-sv" style={{ background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${h},100%,50%))` }}
        onPointerDown={e => drag(e.currentTarget, (fx, fy) => push(h, fx, 1 - fy))(e)}>
        <span className="cp-knob" style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%`, background: hex }} />
      </div>
      <div className="cp-hue" onPointerDown={e => drag(e.currentTarget, fx => push(fx * 359.9, s || 0.01, v || 0.01))(e)}>
        <span className="cp-knob" style={{ left: `${(h / 360) * 100}%`, top: '50%', background: `hsl(${h},100%,50%)` }} />
      </div>
      <div className="cp-row">
        <span className="cp-chip" style={{ background: hex }} />
        <input className="cp-hex" value={hex} maxLength={7} spellCheck={false} aria-label="Hex colour"
          onChange={e => { const t = e.target.value; setHex(t); if (/^#[0-9a-fA-F]{6}$/.test(t)) { const n = rgbToHsv(...(hexToRgb(t) as [number, number, number])); last.current = t.toLowerCase(); setHsv([n[1] === 0 || n[2] === 0 ? h : n[0], n[1], n[2]]); onChange(t); } }} />
      </div>
    </div>
  );
};

// Tab -> layer, verified per model from the live SDK colour order and a render of each SVG region.
// Rugby: body = layer 3, wide bands = layer 2, thin lines/cuffs = layer 1.
// Basketball/Soccer: body = layer 2, bands = layer 1, thin lines/trim = layer 3.
const TABS = ['Jersey', 'Strips 1', 'Strips 2'];
const MODEL_TAB_LAYER = [[2, 1, 0], [1, 0, 2], [1, 0, 2]];

export const ColorTabs: React.FC<{ modelIndex: number }> = observer(({ modelIndex }) => {
  const store = useConfigStore();
  const [tab, setTab] = useState(0);
  if (store.parts.length === 0) return <div className="muted">Loading layers…</div>;
  const map = MODEL_TAB_LAYER[modelIndex] || [2, 1, 0];
  const part = (i: number) => store.parts[Math.min(map[i], store.parts.length - 1)];
  const layer = part(tab);
  return (
    <>
      <div className="ctabs" role="tablist">
        {TABS.map((t, i) => (
          <button key={t} role="tab" aria-selected={i === tab} className={i === tab ? 'on' : ''} onClick={() => { setTab(i); store.setActivePart(part(i).id); }}>{t}</button>
        ))}
      </div>
      <ColorPicker value={layer.color} onChange={c => { store.setActivePart(layer.id); store.setPartColor(layer.id, c); }} />
    </>
  );
});
