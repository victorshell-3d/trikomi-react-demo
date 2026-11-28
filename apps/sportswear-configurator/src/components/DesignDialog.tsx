import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useConfigStore } from '../store/ConfiguratorStore';

const PALETTE = ['#ffffff', '#0f172a', '#dc2626', '#ea580c', '#eab308', '#16a34a', '#0284c7', '#4f46e5', '#9333ea', '#db2777'];

/** Add Text & Logo dialog. Uses the existing store functions (addLogo, addText, updateText, remove*). */
export const DesignDialog: React.FC<{ onClose: () => void }> = observer(({ onClose }) => {
  const store = useConfigStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [str, setStr] = useState('');
  const [font, setFont] = useState('Impact');
  const [color, setColor] = useState('#ffffff');

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      const x = store.centerUV ? store.centerUV.x * 2048 - 140 : 850;
      const y = store.centerUV ? store.centerUV.y * 2048 - 140 : 850;
      const id = `logo-${Date.now()}`;
      store.addLogo({ id, src: ev.target?.result as string, x, y, width: 280, height: 280, rotation: 0 });
      store.setSelectedLogo(id);
    };
    r.readAsDataURL(file);
    e.target.value = '';
  };
  const addText = () => {
    if (!str.trim()) return;
    const x = store.centerUV ? store.centerUV.x * 2048 - 150 : 850;
    const y = store.centerUV ? store.centerUV.y * 2048 - 60 : 850;
    const id = `text-${Date.now()}`;
    store.addText({ id, text: str.trim(), fontFamily: font, color, x, y, width: 280, height: 120, rotation: 0 });
    store.setSelectedText(id);
    setStr('');
  };
  const pickColor = (hex: string) => {
    setColor(hex);
    if (store.selectedTextId) store.updateText(store.selectedTextId, { color: hex });
  };
  const logos = store.logos.filter(l => !l.isText);

  return (
    <div className="dlg-wrap" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dlg" role="dialog" aria-label="Add Text and Logo">
        <div className="dlg-head"><h5>Add Text &amp; Logo</h5><button className="x" aria-label="Close" onClick={onClose}>✕</button></div>

        <div className="dlg-sec">Logo</div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} data-testid="logo-file" />
        <button className="dlg-btn" onClick={() => fileRef.current?.click()}>＋ Upload Logo</button>
        {logos.length > 0 && <div className="chips">{logos.map(l => (
          <span key={l.id} className={`chip${store.selectedLogoId === l.id ? ' on' : ''}`} onClick={() => store.setSelectedLogo(l.id)}>
            <img src={l.src} alt="" /><i onClick={e => { e.stopPropagation(); store.removeLogo(l.id); }} aria-label="Remove logo">✕</i>
          </span>))}</div>}

        <div className="dlg-sec">Text</div>
        <div className="dlg-line">
          <input value={str} onChange={e => setStr(e.target.value)} onKeyDown={e => e.key === 'Enter' && addText()} placeholder="Player # / Name" />
          <button className="dlg-mini" onClick={() => setFont(f => (f === 'Impact' ? 'Arial' : 'Impact'))} title="Toggle font">{font === 'Impact' ? 'Impact' : 'Sans'}</button>
          <button className="dlg-mini add" onClick={addText} aria-label="Add text">+</button>
        </div>
        <div className="dlg-colors">
          {PALETTE.map(h => <span key={h} role="button" aria-label={h} className={`dot${(store.texts.find(t => t.id === store.selectedLogoId)?.textColor || color).toLowerCase() === h ? ' sel' : ''}`} style={{ background: h }} onClick={() => pickColor(h)} />)}
          <label className="dot picker" title="Custom colour">＋<input type="color" value={color} onChange={e => pickColor(e.target.value)} /></label>
        </div>
        {store.texts.length > 0 && <div className="chips">{store.texts.map(t => (
          <span key={t.id} className={`chip text${store.selectedLogoId === t.id ? ' on' : ''}`} onClick={() => store.setSelectedText(t.id)}>
            <b style={{ background: t.textColor || '#fff' }} />{t.text}<i onClick={e => { e.stopPropagation(); store.removeText(t.id); }} aria-label="Remove text">✕</i>
          </span>))}</div>}
        <p className="dlg-tip">Drag the item on the jersey to move it. Use the handles to resize or rotate.</p>
        <button className="add wide" onClick={onClose}>Done</button>
      </div>
    </div>
  );
});
