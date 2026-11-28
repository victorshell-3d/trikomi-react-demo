import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ThreeCanvas, AVAILABLE_MODELS } from './components/ThreeCanvas';
import { MobileConfigDock } from './components/MobileConfigDock';
import { OrderFormModal } from './components/OrderFormModal';
import { DesignDialog } from './components/DesignDialog';
import { useConfigStore } from './store/ConfiguratorStore';
import { DiamondIcon } from './components/icons';
import { Icon3D, G } from './components/Icon3D';
import { ColorTabs } from './components/ColorPicker';
import './fonts.css';
import './index.css';
import './app.css';
import './icons3d.css';
import './glass-navy.css';
import './fit.css';

const A = import.meta.env.BASE_URL + 'assets/';
const SWATCHES = ['#0a0a0f', '#f1f1f1', '#7c3aed', '#4f46e5', '#22c8f0', '#f472b6'];
const FABRICS = [
  { id: 'mesh', label: 'Mesh', note: 'Breathable' },
  { id: 'knit', label: 'Knit', note: 'Textured' },
  { id: 'smooth', label: 'Smooth', note: 'Sleek' },
] as const;
const VIEWS = [['front', 'Front'], ['back', 'Back'], ['left', 'Left'], ['right', 'Right']] as const;

const App = observer(() => {
  const store = useConfigStore();
  const [modelIndex, setModelIndex] = useState(0);
  const [dlg, setDlg] = useState(false);
  const [view, setView] = useState<(typeof VIEWS)[number][0]>('front');


  const changeView = (v: typeof view) => { setView(v); store.triggerViewChange(v); };
  const finish = () => { store.triggerGenerateScreenshots(); store.setShowOrderForm(true); };
  const items = store.logos.length;

  return (
    <div className="app">
      <header className="top">
        <div className="brand"><img src={`${A}trikomi-logo.png`} alt="TRIKOMI" /><span>TRIKOMI</span></div>
        <nav><a className="on">Configurator</a></nav>
      </header>

      <aside className="panel">
        <h3>Choose Style</h3>
        <div className="styles">
          {AVAILABLE_MODELS.map((m, i) => (
            <button key={m.name} className={i === modelIndex ? 'sel' : ''} onClick={() => setModelIndex(i)} aria-label={m.name} title={m.name}>
              <img src={`${A}model-${['rugby', 'basketball', 'soccer'][i]}.png`} alt="" /><small>{m.name.split(' ')[0]}</small>
            </button>
          ))}
        </div>

        <div className="pcol">
        <h4>Pick Colors</h4>
        <ColorTabs modelIndex={modelIndex} />
        </div>
        <div className="pcol">

        <h4>Fabric</h4>
        <div className="fabrics">
          {FABRICS.map(f => (
            <button key={f.id} className={store.fabricType === f.id ? 'sel' : ''} onClick={() => store.setFabricType(f.id)}>
              <Icon3D size={36} hue={f.id === 'mesh' ? 'cyan' : f.id === 'knit' ? 'pink' : 'amber'}>{G[f.id as 'mesh' | 'knit' | 'smooth']}</Icon3D><span className="fab-txt"><b>{f.label}</b><small>{f.note}</small></span>
            </button>
          ))}
        </div>

        <h4>Add Text &amp; Logo</h4>
        <button className="addtext" onClick={() => setDlg(true)}><Icon3D size={40} hue="violet">{G.text}</Icon3D><Icon3D size={40} hue="cyan">{G.image}</Icon3D><span>{items ? `Text & Logo (${items})` : 'Add Text & Logo'}</span><em>›</em></button>
        </div>
      </aside>

      <main className="stage">
        <div className="views" aria-label="Camera views">
          {VIEWS.map(([v, l]) => (
            <button key={v} className={v === view ? 'on' : ''} onClick={() => changeView(v)}><Icon3D size={34} hue={v === 'front' ? 'violet' : v === 'back' ? 'cyan' : v === 'left' ? 'pink' : 'amber'}>{v === 'front' ? G.cube : v === 'back' ? G.shirtBack : v === 'right' ? G.shirtSideR : G.shirtSide}</Icon3D>{l}</button>
          ))}
        </div>
        <div className="canvas-host"><ThreeCanvas modelIndex={modelIndex} onModelChange={setModelIndex} /></div>
        <div className="ring" /><div className="drag">Drag to rotate</div>
      </main>

      <section className="info">
        <small className="eyebrow">BESPOKE</small>
        <h1>SPORTSWEAR<br /><span>CONFIGURATOR</span></h1>
        <p className="sub">Design. Customize. Perform.</p><i className="bar" />
        <div className="fabric"><img src={`${A}fabric.jpg`} alt="" /><div className="tag"><DiamondIcon />Premium Performance Fabric</div></div>
        <ul className="feat">
          {([['lightweight', 'Ultra', 'Lightweight'], ['breathable', 'Breathable', 'Fabric'], ['stretch', '4-Way', 'Stretch'], ['wicking', 'Moisture', 'Wicking']] as const).map(([k, a, b]) => (
            <li key={k}><Icon3D size={46} hue={k === 'lightweight' ? 'violet' : k === 'breathable' ? 'cyan' : k === 'stretch' ? 'pink' : 'amber'}>{G[k === 'lightweight' ? 'feather' : k === 'breathable' ? 'waves' : k === 'stretch' ? 'stretch' : 'drop']}</Icon3D>{a}<br />{b}</li>))}
        </ul>
        <div className="cta">
          <button className="add" onClick={finish}><Icon3D size={34} hue="cyan">{G.doc}</Icon3D>Generate Order Form</button>
        </div>
      </section>

      <div className="mobile-only"><MobileConfigDock modelIndex={modelIndex} /></div>
      {dlg && <DesignDialog onClose={() => setDlg(false)} />}
      <OrderFormModal />
    </div>
  );
});
export default App;
