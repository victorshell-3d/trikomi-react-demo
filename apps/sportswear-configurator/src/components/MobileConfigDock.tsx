import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { FloatingControlDock, type DockTabItem } from '@trikomi/ui-kit';
import { useConfigStore } from '../store/ConfiguratorStore';
import type { ConfigPanel } from './SportswearInspector';

const COLOR_PALETTE = [
  '#ffffff', '#0f172a', '#dc2626', '#ea580c', '#eab308',
  '#16a34a', '#0284c7', '#4f46e5', '#9333ea', '#db2777'
];

export interface MobileConfigDockProps {
  activePanel: ConfigPanel | null;
  onSelectPanel: (panel: ConfigPanel | null) => void;
  isMobile: boolean;
}

export const MobileConfigDock: React.FC<MobileConfigDockProps> = observer(({
  activePanel,
  onSelectPanel,
  isMobile
}) => {
  const configStore = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTextStr, setNewTextStr] = useState('');
  const [selectedFont, setSelectedFont] = useState('Impact');
  const [selectedTextColor, setSelectedTextColor] = useState('#ffffff');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) return;

      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        const width = 240;
        const height = Math.round(width / aspect);

        const targetX = configStore.centerUV ? configStore.centerUV.x * 2048 - width / 2 : 900;
        const targetY = configStore.centerUV ? configStore.centerUV.y * 2048 - height / 2 : 900;

        const newId = `logo-${Date.now()}`;
        configStore.addLogo({
          id: newId,
          src,
          x: targetX,
          y: targetY,
          width,
          height,
          rotation: 0
        });
        configStore.setSelectedLogo(newId);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddText = () => {
    if (!newTextStr.trim()) return;

    const targetX = configStore.centerUV ? configStore.centerUV.x * 2048 - 140 : 880;
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

  const dockItems: DockTabItem[] = [
    {
      id: 'color',
      label: 'Color',
      icon: (
        <span
          className="live-color-badge"
          style={{
            backgroundColor: activePart?.color || '#ffffff',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            display: 'inline-block',
            boxShadow: '0 0 0 1.5px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0,0,0,0.15)'
          }}
        />
      )
    },
    {
      id: 'texture',
      label: 'Fabric',
      badge: configStore.fabricType,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
        </svg>
      )
    },
    {
      id: 'logo',
      label: 'Logo',
      badge: logoCount > 0 ? logoCount : undefined,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      id: 'text',
      label: 'Text',
      badge: textCount > 0 ? textCount : undefined,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      )
    },
    {
      id: 'finishing',
      label: 'Finish',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    }
  ];

  // Mobile Popover Content (Rendered only on mobile)
  const mobilePopoverContent = isMobile && activePanel ? (
    <div style={{ padding: '4px 0' }}>
      {/* 1. COLOR PANEL */}
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
            {COLOR_PALETTE.map((hex) => {
              const isSelected = activePart?.color.toLowerCase() === hex.toLowerCase();
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
                  value={activePart?.color || '#ffffff'}
                  onChange={(e) => configStore.setPartColor(configStore.activePartId, e.target.value)}
                  className="hidden-color-input"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* 2. TEXTURE / FABRIC PANEL */}
      {activePanel === 'texture' && (
        <div className="tooltip-texture-wrap">
          {(['mesh', 'knit', 'smooth'] as const).map((type) => {
            const isSelected = configStore.fabricType === type;
            return (
              <button
                key={type}
                className={`micro-texture-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => configStore.setFabricType(type)}
              >
                <span className="texture-label capitalize">{type}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. LOGO PANEL */}
      {activePanel === 'logo' && (
        <div className="tooltip-logo-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            className="micro-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Upload Logo</span>
          </button>

          {logoCount > 0 && (
            <div className="chips-scroller">
              {configStore.logos.filter((l) => !l.isText).map((logo) => {
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
              onChange={(e) => setNewTextStr(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
              placeholder="Player # / Name"
              className="micro-text-input"
              autoFocus
            />
            <button
              className="micro-font-toggle"
              onClick={() => setSelectedFont((f) => (f === 'Impact' ? 'Arial' : 'Impact'))}
              title="Toggle Font"
            >
              {selectedFont === 'Impact' ? 'Impact' : 'Sans'}
            </button>
            <button className="micro-add-btn" onClick={handleAddText} title="Add Text">
              +
            </button>
          </div>

          <div className="swatch-ribbon" style={{ marginTop: '8px' }}>
            {COLOR_PALETTE.map((hex) => {
              const activeText = configStore.texts.find((t) => t.id === configStore.selectedLogoId);
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
                value={selectedTextColor}
                onChange={(e) => handleTextColorSelect(e.target.value)}
                className="hidden-color-input"
              />
            </label>
          </div>

          {textCount > 0 && (
            <div className="chips-scroller" style={{ marginTop: '8px' }}>
              {configStore.texts.map((textItem) => {
                const isSelected = configStore.selectedLogoId === textItem.id;
                return (
                  <div
                    key={textItem.id}
                    className={`micro-chip text-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => configStore.setSelectedText(textItem.id)}
                  >
                    <span
                      className="chip-dot"
                      style={{
                        backgroundColor: textItem.textColor || (textItem as any).color || '#ffffff',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
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

      {/* 5. FINISHING PANEL */}
      {activePanel === 'finishing' && (
        <div className="tooltip-finishing-wrap">
          <button
            className="micro-order-btn"
            onClick={() => {
              onSelectPanel(null);
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
  ) : undefined;

  return (
    <FloatingControlDock
      items={dockItems}
      activeId={activePanel}
      onSelect={(id) => onSelectPanel(id === activePanel ? null : (id as ConfigPanel))}
      activePopoverContent={mobilePopoverContent}
      onClosePopover={() => onSelectPanel(null)}
      position="bottom"
      elevation="float"
    />
  );
});
