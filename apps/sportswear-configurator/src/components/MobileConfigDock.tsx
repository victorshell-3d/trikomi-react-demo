import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useConfigStore } from '../store/ConfiguratorStore';

type ActivePanel = 'color' | 'texture' | 'logo' | 'text' | 'finishing' | null;

const COLOR_PALETTE = [
  '#ffffff', '#0f172a', '#dc2626', '#ea580c', '#eab308',
  '#16a34a', '#0284c7', '#4f46e5', '#9333ea', '#db2777'
];

export const MobileConfigDock: React.FC = observer(() => {
  const configStore = useConfigStore();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTextStr, setNewTextStr] = useState('');
  const [selectedFont, setSelectedFont] = useState('Impact');
  const [selectedTextColor, setSelectedTextColor] = useState('#ffffff');

  // Dismiss on tap outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        !target.closest('.mobile-dock-btn')
      ) {
        setActivePanel(null);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('touchstart', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const targetX = configStore.centerUV ? configStore.centerUV.x * 2048 - 140 : 850;
      const targetY = configStore.centerUV ? configStore.centerUV.y * 2048 - 140 : 850;
      const newId = `logo-${Date.now()}`;
      configStore.addLogo({
        id: newId,
        src: event.target?.result as string,
        x: targetX,
        y: targetY,
        width: 280,
        height: 280,
        rotation: 0
      });
      configStore.setSelectedLogo(newId);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddText = () => {
    if (!newTextStr.trim()) return;
    const targetX = configStore.centerUV ? configStore.centerUV.x * 2048 - 150 : 850;
    const targetY = configStore.centerUV ? configStore.centerUV.y * 2048 - 60 : 850;
    const newId = `text-${Date.now()}`;
    configStore.addText({
      id: newId,
      text: newTextStr.trim(),
      fontFamily: selectedFont,
      color: selectedTextColor,
      x: targetX,
      y: targetY,
      width: 280,
      height: 120,
      rotation: 0
    });
    configStore.setSelectedText(newId);
    setNewTextStr('');
  };

  const handleTextColorSelect = (hex: string) => {
    setSelectedTextColor(hex);
    if (configStore.selectedTextId) {
      configStore.updateText(configStore.selectedTextId, { color: hex });
    }
  };

  const activePart = configStore.parts.find(p => p.id === configStore.activePartId) || configStore.parts[0];
  const logoCount = configStore.logos.filter(l => !l.isText).length;
  const textCount = configStore.texts.length;

  return (
    <>
      {/* Dynamic Popover Bubble */}
      {activePanel && (
        <div ref={popupRef} className="dock-tooltip-bubble animate-spring-up">
          {/* 1. COLOR PANEL: Just #1 #2 #3 and compact swatches */}
          {activePanel === 'color' && (
            <div className="tooltip-color-wrap">
              <div className="layer-numbers-bar">
                {configStore.parts.map((part, idx) => {
                  const isActive = configStore.activePartId === part.id;
                  return (
                    <button
                      key={part.id}
                      className={`layer-num-btn ${isActive ? 'active' : ''}`}
                      onClick={() => configStore.setActivePart(part.id)}
                    >
                      <span className="layer-dot" style={{ backgroundColor: part.color }} />
                      <span className="layer-num">#{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              <div className="swatch-ribbon">
                {COLOR_PALETTE.map(hex => {
                  const currentPart = configStore.parts.find(p => p.id === configStore.activePartId);
                  const isSelected = currentPart?.color.toLowerCase() === hex.toLowerCase();
                  return (
                    <button
                      key={hex}
                      className={`micro-swatch ${isSelected ? 'selected' : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => {
                        if (configStore.activePartId) {
                          configStore.setPartColor(configStore.activePartId, hex);
                        }
                      }}
                    />
                  );
                })}

                {configStore.activePartId && (
                  <label className="native-picker-trigger" title="Custom Color">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <input
                      type="color"
                      value={configStore.parts.find(p => p.id === configStore.activePartId)?.color || '#ffffff'}
                      onChange={e => configStore.setPartColor(configStore.activePartId, e.target.value)}
                      className="hidden-color-input"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* 2. TEXTURE PANEL */}
          {activePanel === 'texture' && (
            <div className="tooltip-pills-row">
              {(['mesh', 'knit', 'smooth'] as const).map(type => {
                const isSelected = configStore.fabricType === type;
                return (
                  <button
                    key={type}
                    className={`micro-pill-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => configStore.setFabricType(type)}
                  >
                    <span className="pill-text">
                      {type === 'mesh' ? 'Mesh' : type === 'knit' ? 'Knit' : 'Smooth'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. LOGO PANEL */}
          {activePanel === 'logo' && (
            <div className="tooltip-logo-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              
              <button
                className="micro-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Upload Logo</span>
              </button>

              {logoCount > 0 && (
                <div className="chips-scroller">
                  {configStore.logos.filter(l => !l.isText).map(logo => {
                    const isSelected = configStore.selectedLogoId === logo.id;
                    return (
                      <div
                        key={logo.id}
                        className={`micro-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => configStore.setSelectedLogo(logo.id)}
                      >
                        <img src={logo.src} alt="" className="chip-img" />
                        <button
                          className="chip-del"
                          onClick={(e) => {
                            e.stopPropagation();
                            configStore.removeLogo(logo.id);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. TEXT PANEL */}
          {activePanel === 'text' && (
            <div className="tooltip-text-wrap">
              <div className="text-inline-form">
                <input
                  type="text"
                  value={newTextStr}
                  onChange={e => setNewTextStr(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddText()}
                  placeholder="Player # / Name"
                  className="micro-text-input"
                  autoFocus
                />
                <button
                  className="micro-font-toggle"
                  onClick={() => setSelectedFont(f => f === 'Impact' ? 'Arial' : 'Impact')}
                  title="Toggle Font"
                >
                  {selectedFont === 'Impact' ? 'Impact' : 'Sans'}
                </button>
                <button className="micro-add-btn" onClick={handleAddText} title="Add Text">
                  +
                </button>
              </div>

              {/* Text Color Swatches Ribbon */}
              <div className="swatch-ribbon" style={{ marginTop: '8px' }}>
                {COLOR_PALETTE.map(hex => {
                  const activeText = configStore.texts.find(t => t.id === configStore.selectedLogoId);
                  const currentHex = activeText?.textColor || selectedTextColor;
                  const isSelected = currentHex.toLowerCase() === hex.toLowerCase();
                  return (
                    <button
                      key={hex}
                      className={`micro-swatch ${isSelected ? 'selected' : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => handleTextColorSelect(hex)}
                      title={hex}
                    />
                  );
                })}

                <label className="native-picker-trigger" title="Custom Text Color">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <input
                    type="color"
                    value={configStore.texts.find(t => t.id === configStore.selectedLogoId)?.textColor || selectedTextColor}
                    onChange={e => handleTextColorSelect(e.target.value)}
                    className="hidden-color-input"
                  />
                </label>
              </div>

              {textCount > 0 && (
                <div className="chips-scroller" style={{ marginTop: '8px' }}>
                  {configStore.texts.map(textItem => {
                    const isSelected = configStore.selectedLogoId === textItem.id;
                    return (
                      <div
                        key={textItem.id}
                        className={`micro-chip text-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => configStore.setSelectedText(textItem.id)}
                      >
                        <span
                          className="chip-color-dot"
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: textItem.textColor || '#ffffff',
                            display: 'inline-block',
                            marginRight: '4px'
                          }}
                        />
                        <span className="chip-label">{textItem.text}</span>
                        <button
                          className="chip-del"
                          onClick={(e) => {
                            e.stopPropagation();
                            configStore.removeText(textItem.id);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5. FINISHING PANEL: Direct Order Trigger */}
          {activePanel === 'finishing' && (
            <div className="tooltip-finishing-wrap">
              <button
                className="micro-order-btn"
                onClick={() => {
                  setActivePanel(null);
                  configStore.triggerGenerateScreenshots();
                  configStore.setShowOrderForm(true);
                }}
              >
                <span>Finish & Request Order</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Interactive Dock (Alive with state badges) */}
      <nav className="alive-bottom-dock">
        {/* 1. Color Button with Live Part Swatch */}
        <button
          className={`mobile-dock-btn ${activePanel === 'color' ? 'active' : ''}`}
          onClick={() => togglePanel('color')}
          aria-label="Color"
        >
          <div className="dock-icon-wrap">
            <span
              className="live-color-badge"
              style={{ backgroundColor: activePart?.color || '#ffffff' }}
            />
          </div>
          <span className="dock-label">Color</span>
        </button>

        {/* 2. Fabric Button with Live Type Indicator */}
        <button
          className={`mobile-dock-btn ${activePanel === 'texture' ? 'active' : ''}`}
          onClick={() => togglePanel('texture')}
          aria-label="Fabric"
        >
          <div className="dock-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
            </svg>
          </div>
          <span className="dock-label capitalize">{configStore.fabricType}</span>
        </button>

        {/* 3. Logo Button with Live Count Badge */}
        <button
          className={`mobile-dock-btn ${activePanel === 'logo' ? 'active' : ''}`}
          onClick={() => togglePanel('logo')}
          aria-label="Logo"
        >
          <div className="dock-icon-wrap has-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {logoCount > 0 && <span className="live-count-pill">{logoCount}</span>}
          </div>
          <span className="dock-label">Logo</span>
        </button>

        {/* 4. Text Button with Live Text Count Badge */}
        <button
          className={`mobile-dock-btn ${activePanel === 'text' ? 'active' : ''}`}
          onClick={() => togglePanel('text')}
          aria-label="Text"
        >
          <div className="dock-icon-wrap has-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
            {textCount > 0 && <span className="live-count-pill">{textCount}</span>}
          </div>
          <span className="dock-label">Text</span>
        </button>

        {/* 5. Finish Button with Glow Accent */}
        <button
          className={`mobile-dock-btn finishing ${activePanel === 'finishing' ? 'active' : ''}`}
          onClick={() => togglePanel('finishing')}
          aria-label="Finish"
        >
          <div className="dock-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="dock-label">Finish</span>
        </button>
      </nav>
    </>
  );
});
