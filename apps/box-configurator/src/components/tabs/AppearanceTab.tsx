import React from 'react';
import { observer } from 'mobx-react-lite';
import { configStore } from '../../store/ConfigStore';

const BoxMaterialThemeCard = observer(() => {
  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
        </svg>
        Box Material & Theme
      </div>

      <div className="control-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '0.75rem' }}>Global Paint Color</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={configStore.rootNode.color || '#ffffff'}
            onChange={(e) => { configStore.setGlobalBoxColor(e.target.value); }}
            style={{ padding: '0', height: '28px', width: '36px', border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{configStore.rootNode.color || '#ffffff'}</span>
        </div>
      </div>

      <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
        <label style={{ fontSize: '0.75rem' }}>Material Pattern Texture</label>
        <select
          value={configStore.activePattern}
          onChange={(e) => {
            configStore.setActivePattern(e.target.value);
          }}
          style={{
            background: '#1f2937',
            color: 'white',
            border: '1px solid var(--color-border)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            outline: 'none',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <option value="none">Solid Color Finish</option>
          <option value="kraft">Natural Kraft Cardboard</option>
          <option value="grid">Blueprint Grid Paper</option>
          <option value="dots">Polka Dots</option>
          <option value="stripes">Diagonal Stripes</option>
        </select>
      </div>
    </div>
  );
});

const GraphicsOverlayCard = observer(() => {
  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
        Graphics Overlay
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => {
            const id = Date.now().toString();
            const b = configStore.layoutBounds;
            configStore.designElements.push({
              id,
              type: 'text',
              text: 'New Text',
              x: b.minX + b.width / 2,
              y: b.minY + b.height / 2,
              scale: 1,
              color: '#000000',
              fontSize: 24,
              fontFamily: 'sans-serif',
              rotation: 0
            });
            configStore.setSelectedDesignElementId(id);
            configStore.setSelectedNodeId(null);
          }}
          style={{ width: '100%' }}
        >
          + Add Text Layer
        </button>
        <label className="nav-button" style={{ cursor: 'pointer', width: '100%' }}>
          + Add Image Layer
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  const img = new window.Image();
                  img.onload = () => {
                    const id = Date.now().toString();
                    const b = configStore.layoutBounds;
                    const targetWidth = 150;
                    const scale = targetWidth / img.width;
                    const targetHeight = img.height * scale;

                    configStore.designElements.push({
                      id,
                      type: 'logo',
                      src: reader.result as string,
                      x: b.minX + b.width / 2 - targetWidth / 2,
                      y: b.minY + b.height / 2 - targetHeight / 2,
                      width: targetWidth,
                      height: targetHeight,
                      scale: 1,
                      rotation: 0
                    });
                    configStore.setSelectedDesignElementId(id);
                    configStore.setSelectedNodeId(null);
                  };
                  img.src = reader.result as string;
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
});

const ActiveLayersCard = observer(() => {
  if (configStore.designElements.length === 0) return null;

  return (
    <div className="control-card">
      <div className="control-card-title">Active Layers</div>
      <div className="graphics-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {configStore.designElements.map((el, i) => (
          <div
            key={el.id}
            className={`graphics-item ${configStore.selectedDesignElementId === el.id ? 'active' : ''}`}
            onClick={() => {
              configStore.setSelectedDesignElementId(el.id);
              configStore.setSelectedNodeId(null);
            }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid ' + (configStore.selectedDesignElementId === el.id ? '#818cf8' : 'transparent'),
              background: configStore.selectedDesignElementId === el.id ? 'rgba(129, 140, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px', fontSize: '0.8rem', color: 'var(--color-text-main)' }}>
              {el.type === 'text' ? `Text: "${el.text}"` : 'Uploaded Graphic'}
            </span>
            <button
              className="graphics-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                configStore.designElements.splice(i, 1);
                if (configStore.selectedDesignElementId === el.id) {
                  configStore.setSelectedDesignElementId(null);
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fc8181',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

const SelectedLayerEditorCard = observer(() => {
  if (!configStore.selectedDesignElementId) return null;
  
  const el = configStore.designElements.find(e => e.id === configStore.selectedDesignElementId);
  if (!el) return null;

  return (
    <div className="control-card">
      <div className="control-card-title">Edit Selected Layer</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {el.type === 'text' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Text Content</label>
              <input
                type="text"
                value={el.text || ''}
                onChange={(e) => { el.text = e.target.value; }}
                style={{ width: '100%', background: '#1a1d24', color: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Font Size (px)</label>
                <input
                  type="number"
                  min="8"
                  max="120"
                  value={el.fontSize || 24}
                  onChange={(e) => { el.fontSize = parseInt(e.target.value) || 24; }}
                  style={{ width: '100%', background: '#1a1d24', color: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Text Color</label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={el.color || '#000000'}
                    onChange={(e) => { el.color = e.target.value; }}
                    style={{ padding: '0', height: '32px', width: '40px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-main)', fontFamily: 'monospace' }}>{el.color}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Font Family</label>
              <select
                value={el.fontFamily || 'sans-serif'}
                onChange={(e) => { el.fontFamily = e.target.value; }}
                style={{ width: '100%', background: '#1a1d24', color: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}
              >
                <option value="sans-serif">Sans-Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
                <option value="Outfit">Outfit</option>
                <option value="Inter">Inter</option>
                <option value="Impact">Impact</option>
              </select>
            </div>
          </>
        )}

        {el.type === 'logo' && (
          <>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Width (px)</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={Math.round(el.width || 100)}
                  onChange={(e) => { el.width = parseInt(e.target.value) || 100; }}
                  style={{ width: '100%', background: '#1a1d24', color: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Height (px)</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={Math.round(el.height || 100)}
                  onChange={(e) => { el.height = parseInt(e.target.value) || 100; }}
                  style={{ width: '100%', background: '#1a1d24', color: 'white', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}
                />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Rotation (°)</label>
            <input
              type="range"
              min="0"
              max="360"
              value={Math.round(((el.rotation || 0) % 360 + 360) % 360)}
              onChange={(e) => { el.rotation = ((parseInt(e.target.value) || 0) % 360 + 360) % 360; }}
              style={{ width: '100%', accentColor: '#818cf8' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              <span>0°</span>
              <span style={{ fontWeight: 'bold', color: '#a5b4fc' }}>{Math.round(((el.rotation || 0) % 360 + 360) % 360)}°</span>
              <span>360°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const AppearanceTab = observer(() => {
  return (
    <>
      <BoxMaterialThemeCard />
      <GraphicsOverlayCard />
      <ActiveLayersCard />
      <SelectedLayerEditorCard />
    </>
  );
});
