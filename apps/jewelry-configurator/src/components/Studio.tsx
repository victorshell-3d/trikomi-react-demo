import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Studio.css';
import { RingStage } from './RingStage';
import type { RingController } from './RingStage';

type Design = { ringIndex: number; metal: string; size: string; stone: string; carat: string; finish: string; stoneColor: string; engraving: string };
type SavedDesign = Design & { ring: string; ringIndex: number; image: string };
const initial: Design = { ringIndex: 0, metal: 'Yellow gold', size: '7', stone: 'Original', carat: '100%', finish: 'Polished', stoneColor: '#ffffff', engraving: '' };
const asset = (name: string) => `${import.meta.env.BASE_URL}studio/${name}`;
const steps = ['Metal', 'Stone', 'Design', 'Review'];
const stepCta = ['Continue to Stone', 'Continue to Design', 'Continue to Review', 'Add to Cart'];
function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    ring: <><circle cx="12" cy="16" r="7"/><path d="m8 5 2-3h4l2 3-4 5z"/></>,
    necklace: <><path d="M3 4c0 16 18 16 18 0M9 19l3-4 3 4-3 5z"/></>,
    bangles: <><ellipse cx="10" cy="13" rx="7" ry="10"/><ellipse cx="15" cy="13" rx="6" ry="10"/></>,
    save: <><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M4 15v6h16v-6"/></>,
    check: <path d="m5 13 4 4L19 7"/>,
    reset: <><path d="M20 8a9 9 0 1 0 1 7M20 3v5h-5"/></>,
    undo: <><path d="m8 4-6 6 6 6M2 10h11a7 7 0 0 1 0 14"/></>,
    redo: <><path d="m16 4 6 6-6 6m6-6H11a7 7 0 0 0 0 14"/></>,
    arrow: <><path d="M3 12h18m-7-7 7 7-7 7"/></>,
    rotate: <><path d="M20 7A9 9 0 0 0 4 8M4 3v5h5m-5 9a9 9 0 0 0 16-1m0 5v-5h-5"/></>,
    ar: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><rect x="9" y="9" width="6" height="6"/></>,
    expand: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/></>,
    cube: <><path d="m12 2 10 6v10l-10 6-10-6V8zm0 0v12m10-6-10 6L2 8m10 6v10"/><circle cx="7" cy="12" r=".7"/><circle cx="17" cy="12" r=".7"/></>,
    close: <path d="m5 5 14 14M19 5 5 19"/>,
    heart: <path d="M12 20.3l-1.4-1.3C5.7 14.7 2.5 11.8 2.5 8.3 2.5 5.4 4.9 3 7.8 3c1.7 0 3.3.8 4.2 2.1C12.9 3.8 14.5 3 16.2 3c2.9 0 5.3 2.4 5.3 5.3 0 3.5-3.2 6.4-8.1 10.7L12 20.3z"/>,
  };
  return <svg viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function Studio() {
  const [panelOpen,setPanelOpen]=useState(true);
  const [drawerFull,setDrawerFull]=useState(false);
  const [loading,setLoading]=useState(false);
  const [failedRing,setFailedRing]=useState<number|null>(null);
  const [inspecting,setInspecting]=useState(false);
  const [hexDraft,setHexDraft]=useState('#ffffff');
  const shapeLabel=(value:string)=>value==='shape'?'Octagonal':value==='shape024'?'Round':value;
  const [history, setHistory] = useState<Design[]>([{ ...initial }]);
  const [cursor, setCursor] = useState(0);
  const design = history[cursor];
  const [step, setStep] = useState(0);
  const [view, setViewState] = useState('hero');
  const [ringStatus, setRingStatus] = useState('Loading VictorShell ring…');
  const controller = useRef<RingController | null>(null);
  const onRingReady = useCallback((value: RingController) => { controller.current = value; }, []);
  const onRingStatus = useCallback((value: string) => setRingStatus(value), []);
  const ringIndex=design.ringIndex;
  useEffect(()=>{setHexDraft(design.stoneColor);},[design.stoneColor]);
  const importInput = useRef<HTMLInputElement>(null);
  async function switchRing(index: number) {
    if(loading||index===ringIndex)return;
    setLoading(true);setFailedRing(null);
    try{await controller.current?.changeRing(index);setHistory([...history.slice(0,cursor+1),{...design,ringIndex:index}]);setCursor(cursor+1);}
    catch{setFailedRing(index);notify('Could not load this ring. Your previous design is still selected.');}
    finally{setLoading(false);}
  }
  function setView(value: string) { setViewState(value); controller.current?.setView(value); }
  // Step changes move the camera themselves, so a selected view pill would stop matching the actual camera.
  function goToStep(index: number) { if(inspecting){controller.current?.inspectStone();setInspecting(false);}setStep(index); setViewState('hero'); }
  const [notice, setNotice] = useState('');
  const [savedOk, setSavedOk] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const [items, setItems] = useState<SavedDesign[]>([]);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [hd, setHd] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function notify(message: string) {
    setNotice(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setNotice(''), 4200);
  }
  function update(key: keyof Omit<Design,'ringIndex'>, value: string) {
    if (key==='stoneColor')setHexDraft(value);
    if (design[key] === value) return;
    setHistory([...history.slice(0, cursor + 1), { ...design, [key]: value }]);
    setCursor(cursor + 1);
  }
  async function restoreHistory(index:number){
    if(loading||index<0||index>=history.length)return;
    setLoading(true);
    try{if(history[index].ringIndex!==ringIndex)await controller.current?.changeRing(history[index].ringIndex);controller.current?.replay();setCursor(index);}
    catch{notify('Could not restore the previous ring. Please retry.');}
    finally{setLoading(false);}
  }
  async function reset() {
    if(loading)return;setLoading(true);
    try{if(ringIndex!==0)await controller.current?.changeRing(0);setHistory([...history.slice(0,cursor+1),{...initial}]);setCursor(cursor+1);setStep(0);setView('hero');notify('Your design has been reset.');}
    catch{notify('Could not reset the ring. Please retry.');}
    finally{setLoading(false);}
  }
  function addToCollection() {
    setItems([...items, { ...design, ring: ringIndex === 0 ? 'Classic' : 'Halo',ringIndex,image:controller.current?.snapshot() || '' }]);
    controller.current?.sparkle();
    setHeartPop(true); setTimeout(() => setHeartPop(false), 500);
    notify('Added to your collection.');
  }
  function toggleHd() {
    const next = !hd; setHd(next); controller.current?.setHd(next);
  }
  function save() {
    const content = { collection: 'Studio noir', ring: ringIndex === 0 ? 'Classic' : 'Halo', metal:design.metal, ringSize:design.size, mainStoneCut:design.stone,stoneColor:design.stoneColor, stoneScale:design.carat, finish:design.finish, designNote:design.engraving, preview: 'VictorShell 3D model, visual configuration. Sizes are visual scales, not physical measurements.' };
    const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'studio-noir-design.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    controller.current?.celebrate();
    setSavedOk(true); setTimeout(() => setSavedOk(false), 1600);
    notify('Your design has been downloaded.');
  }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { notify('Fullscreen is not available in this browser.'); }
  }
  const selection = (key: keyof Omit<Design,'ringIndex'>, values: string[], kind = '') => <div className={`studio-options ${kind}`} role="group" aria-label={key}>{values.map(value => <button key={value} type="button" className={design[key] === value ? 'selected' : ''} aria-pressed={design[key] === value} onClick={() => update(key, value)}><img className="studio-option-preview" src={asset(`option-icons/${value.toLowerCase().replace(/ /g, '-')}.svg`)} alt=""/><span>{key === 'stone' ? shapeLabel(value) : value}</span></button>)}</div>;
  const reviewRows: [string, string][] = [['Ring style',ringIndex===0?'Classic':'Halo'], ['Metal', design.metal], ['Ring size', design.size], ['Main stone cut', shapeLabel(design.stone)], ['Stone colour', design.stoneColor], ['Stone size', design.carat], ['Finish', design.finish], ['Design note', design.engraving || 'None']];
  return <main className={`studio ${panelOpen?'panel-open':'panel-closed'} ${drawerFull?'drawer-full':''} ${inspecting?'inspecting':''}`} aria-label="Jewelry studio configurator">
    <div className="studio-photograph" aria-hidden="true"/>
    <header className="studio-header">
      <div className="studio-brand"><img src={asset('victorshell-original.png')} alt="VictorShell"/><span className="studio-brand-pill">Jewelry Configurator</span></div>
      <nav className="studio-nav" aria-label="Saved designs"><button onClick={() => setCollectionsOpen(true)}>Collections{items.length > 0 && <span className="studio-badge">{items.length}</span>}</button></nav>
      <div className="studio-header-actions"><button className={heartPop ? 'studio-icon-btn pop' : 'studio-icon-btn'} aria-label="Add current design to collections" onClick={addToCollection}><Icon name="heart"/></button><button className={savedOk ? 'studio-save saved' : 'studio-save'} onClick={save}><Icon name={savedOk ? 'check' : 'save'}/><span>{savedOk ? 'Saved' : 'Save'}</span></button></div>
    </header>
    <button className="studio-drawer-toggle" aria-label={panelOpen?'Hide customization panel':'Show customization panel'} aria-expanded={panelOpen} aria-controls="studio-controls" onClick={()=>setPanelOpen(!panelOpen)}><span aria-hidden="true">{panelOpen?'‹':'›'}</span></button>
    <section className="studio-intro" aria-hidden={!panelOpen}><h1>A signature,<br/><em>uniquely yours.</em></h1><p className="studio-description">Choose the metal, stone and finish for your ring.</p></section>
    <section className="studio-stage" aria-label="Interactive 3D ring preview">


      <div className="studio-spotlight" aria-hidden="true"/>
      <span className="studio-live-label">LIVE 3D · Drag to rotate</span><RingStage design={design} step={step} onReady={onRingReady} onStatus={onRingStatus}/>
      {ringStatus && <div className="studio-ring-status" role="status">{ringStatus}</div>}

      <div className="studio-tools" aria-label="Jewellery and view tools">
        <div className="studio-category-tools" aria-label="Jewellery categories"><button aria-pressed="true" title="Ring"><Icon name="ring"/><span>Ring</span></button><button onClick={() => { window.location.href = `${import.meta.env.BASE_URL}concepts/necklace/index.html`; }} title="Necklace"><Icon name="necklace"/><span>Necklace</span></button><button onClick={() => { window.location.href = `${import.meta.env.BASE_URL}concepts/bangle/index.html`; }} title="Bangles"><Icon name="bangles"/><span>Bangles</span></button></div>

        <button onClick={() => controller.current?.rotate()} title="Rotate product 360 degrees" aria-label="Rotate product 360 degrees"><Icon name="rotate"/><span>360°</span></button>

        <button onClick={fullscreen} title="Fullscreen" aria-label="Toggle fullscreen"><Icon name="expand"/></button>
        <button className="studio-hd" aria-pressed={hd} onClick={toggleHd} title="Bloom glow" aria-label="Toggle glow"><span>Glow</span></button>
      </div>
      <div className="studio-view-options"><button onClick={() => {controller.current?.resetView();setViewState('hero');setInspecting(false);}} aria-label="Fit ring and base in view"><Icon name="reset"/><span>Reset view</span></button><button className={view !== 'side' ? 'selected' : ''} aria-pressed={view !== 'side'} onClick={() => setView(view === 'front' ? 'hero' : 'front')}><Icon name="cube"/><span>Front view</span></button><button className={view === 'side' ? 'selected' : ''} aria-pressed={view === 'side'} onClick={() => setView(view === 'side' ? 'hero' : 'side')}><Icon name="rotate"/><span>Side view</span></button></div>
    </section>
    <section id="studio-controls" className="studio-controls" aria-label="Customize your ring" inert={!panelOpen}>
      <button className="studio-mobile-expand" aria-expanded={drawerFull} onClick={()=>setDrawerFull(!drawerFull)}>{drawerFull?'Less options':'More options'}<span aria-hidden="true">{drawerFull?'⌄':'⌃'}</span></button>
      <button className="studio-live-summary" onClick={()=>goToStep(3)} title="Review current design">{design.metal} · {shapeLabel(design.stone)} · <span style={{background:design.stoneColor}}/> {design.stoneColor}</button>
      <nav className="studio-steps" aria-label="Design steps">{steps.map((label, index) => <button key={label} onClick={() => goToStep(index)} className={index === step ? 'active' : ''} aria-current={index === step ? 'step' : undefined}><span className="step-number">0{index + 1}</span><span>{label}</span></button>)}</nav>
      <div className="studio-fields">
        {step === 0 && <><div className="studio-field"><h2>Metal</h2>{selection('metal', ['Rose gold', 'Yellow gold', 'Platinum', 'White gold'], 'materials')}</div><div className="studio-field"><h2>Ring size <span className="optional">Visual scale</span></h2>{selection('size', ['6', '7', '8', '9', '10'], 'sizes')}</div></>}
        {step === 1 && <><div className="studio-field"><h2>Main stone cut</h2>{selection('stone', ['Original', 'shape', 'shape024'], 'materials stones')}</div><div className="studio-field"><label htmlFor="stone-colour">Stone colour</label><div className="studio-colour"><input id="stone-colour" type="color" value={design.stoneColor} onChange={event=>update('stoneColor',event.target.value)}/><input aria-label="Stone colour HEX" value={hexDraft} maxLength={7} onChange={event=>setHexDraft(event.target.value)} onBlur={()=>{if(/^#[0-9a-f]{6}$/i.test(hexDraft))update('stoneColor',hexDraft);else setHexDraft(design.stoneColor);}} onKeyDown={event=>{if(event.key==='Enter')event.currentTarget.blur();}}/><button onClick={()=>update('stoneColor','#ffffff')}>Clear</button></div><div className="studio-swatches" aria-label="Quick stone colours">{['#ffffff','#cf344f','#2b65cf','#259f79','#a37bdb','#e7bd55'].map(colour=><button key={colour} aria-label={`Stone colour ${colour}`} style={{background:colour}} onClick={()=>update('stoneColor',colour)}/>)}</div><button className="studio-inspect" onClick={()=>{controller.current?.inspectStone();setInspecting(!inspecting);}}>{inspecting?'Back to design':'Inspect stone'}</button></div><div className="studio-field"><h2>Stone size <span className="optional">Visual scale</span></h2>{selection('carat', ['90%', '100%', '110%'])}</div></>}
        {step === 2 && <><div className="studio-field"><h2>Ring style</h2><div className="studio-model-cards">{['Classic','Halo'].map((name,index)=><button disabled={loading} key={name} aria-pressed={ringIndex===index} onClick={()=>void switchRing(index)}><img src={`${import.meta.env.BASE_URL}thumbs/ring${index+1}.png`} alt=""/>{name}</button>)}</div></div><div className="studio-field"><h2>Finish</h2>{selection('finish', ['Polished', 'Satin', 'Brushed'], 'finish-options')}</div><div className="studio-field"><label htmlFor="engraving">Design note <span className="optional">Not engraved in 3D</span></label><input id="engraving" value={design.engraving} maxLength={24} onChange={event => update('engraving', event.target.value)} placeholder="Optional note for this design"/><span className="engraving-count">{design.engraving.length}/24 characters</span></div></>}
        {step === 3 && <div className="studio-field"><h2>Your design</h2><dl className="studio-review">{reviewRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="review-note">Your choices are applied to the 3D ring. Ring size and stone size are visual scales, not physical measurements. The design note is not engraved. No order is placed.</p></div>}
      </div>
      <button className="studio-continue" onClick={() => step < 3 ? goToStep(step + 1) : addToCollection()}>{stepCta[step]}<Icon name="arrow"/></button>
      <div className="studio-ring-switch"><span>Tools</span><button onClick={() => importInput.current?.click()}>Import</button><button onClick={() => controller.current?.exportModel()}>Export GLB</button><input type="file" accept=".glb" ref={importInput} hidden onChange={event => {const file=event.target.files?.[0];if(file)void controller.current?.importModel(file).catch(()=>notify('Import failed. Your previous ring is still available.'));event.target.value='';}}/></div>{loading&&<span role="status">Loading ring…</span>}{failedRing!==null&&<button onClick={()=>void switchRing(failedRing)}>Retry ring</button>}
    </section>
    <div className="studio-history"><button onClick={() => void restoreHistory(cursor-1)} disabled={loading||cursor === 0}><Icon name="undo"/>Undo</button><span/><button onClick={() => void restoreHistory(cursor+1)} disabled={loading||cursor >= history.length - 1}><Icon name="redo"/>Redo</button><span/><button onClick={reset}><Icon name="reset"/>Reset</button></div>
    {notice && <div className="studio-notice" role="status">{notice}</div>}
    {collectionsOpen && <div className="studio-dialog-backdrop" onClick={() => setCollectionsOpen(false)}><section className="studio-dialog studio-collections" role="dialog" aria-modal="true" aria-label="Collections" onClick={event => event.stopPropagation()}><button className="dialog-close" aria-label="Close collections" onClick={() => setCollectionsOpen(false)} autoFocus><Icon name="close"/></button><p>COLLECTIONS</p><h2>Saved designs</h2>{items.length === 0 ? <p className="review-note">No saved designs yet. Finish the four steps and save a design to see it here.</p> : <ul>{items.map((item, index) => <li key={index}>{item.image&&<img className="studio-saved-image" src={item.image} alt={`${item.ring} saved design`}/>}<span>{item.ring} · {item.metal} · Size {item.size} · {shapeLabel(item.stone)} · {item.stoneColor} · {item.finish}{item.engraving ? ` · "${item.engraving}"` : ''}</span><button onClick={async()=>{setLoading(true);try{if(item.ringIndex!==ringIndex)await controller.current?.changeRing(item.ringIndex);setHistory([...history.slice(0,cursor+1),{ringIndex:item.ringIndex,metal:item.metal,size:item.size,stone:item.stone,stoneColor:item.stoneColor,carat:item.carat,finish:item.finish,engraving:item.engraving}]);setCursor(cursor+1);setCollectionsOpen(false);}catch{notify('Could not restore this design. Please retry.');}finally{setLoading(false);}}} disabled={loading}>Restore / Edit</button><button aria-label={`Remove design ${index + 1}`} onClick={() => setItems(items.filter((_, i) => i !== index))}><Icon name="close"/></button></li>)}</ul>}</section></div>}
  </main>;
}
