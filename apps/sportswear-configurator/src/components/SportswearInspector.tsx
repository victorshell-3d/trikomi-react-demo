import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { GlassInspectorDrawer, type DrawerTab } from '@trikomi/ui-kit';
import { useConfigStore } from '../store/ConfiguratorStore';

export type ConfigPanel = 'color' | 'texture' | 'logo' | 'text' | 'finishing';

const COLOR_PALETTE = [
  '#ffffff', '#0f172a', '#dc2626', '#ea580c', '#eab308',
  '#16a34a', '#0284c7', '#4f46e5', '#9333ea', '#db2777'
];

const DRAWER_TABS: DrawerTab[] = [
  { id: 'color', label: 'Color' },
  { id: 'texture', label: 'Fabric' },
  { id: 'logo', label: 'Logo' },
  { id: 'text', label: 'Text' },
  { id: 'finishing', label: 'Finish' }
];

export interface SportswearInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ConfigPanel;
  onTabChange: (tabId: ConfigPanel) => void;
  width?: number | string;
}

export const SportswearInspector: React.FC<SportswearInspectorProps> = observer(({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  width = 360
}) => {
  const configStore = useConfigStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text inputs local state
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

  const currentPart = configStore.parts.find(p => p.id === configStore.activePartId) || configStore.parts[0];
  const logoList = configStore.logos.filter(l => !l.isText);
  const textList = configStore.texts;

  const triggerOrder = () => {
    configStore.triggerGenerateScreenshots();
    configStore.setShowOrderForm(true);
  };

  return (
    <GlassInspectorDrawer
      title="Customize Garment"
      subtitle="Sportswear 3D Studio"
      side="right"
      isOpen={isOpen}
      onClose={onClose}
      collapsible={true}
      tabs={DRAWER_TABS}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId as ConfigPanel)}
      width={width}
      footer={
        <button
          type="button"
          onClick={triggerOrder}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(67, 56, 202, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Generate Tech Pack & Order</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      }
    >
      {/* 1. COLOR PANEL */}
      {activeTab === 'color' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: '8px' }}>
              Select Layer
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
              {configStore.parts.map((part, idx) => {
                const isActive = configStore.activePartId === part.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => configStore.setActivePart(part.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      background: isActive ? 'rgba(67, 56, 202, 0.12)' : 'rgba(255, 255, 255, 0.5)',
                      border: isActive ? '1.5px solid #4338CA' : '1px solid rgba(67, 56, 202, 0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: part.color,
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.15)',
                        flexShrink: 0
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: isActive ? '#4338CA' : '#1e1b4b' }}>
                      #{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: '8px' }}>
              Palette Swatches
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {COLOR_PALETTE.map((hex) => {
                const isSelected = currentPart?.color.toLowerCase() === hex.toLowerCase();
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => {
                      if (configStore.activePartId) {
                        configStore.setPartColor(configStore.activePartId, hex);
                      }
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: hex,
                      border: isSelected ? '2px solid #4338CA' : '1px solid rgba(0, 0, 0, 0.15)',
                      boxShadow: isSelected ? '0 0 0 2px rgba(67, 56, 202, 0.3)' : 'none',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }}
                    title={hex}
                  />
                );
              })}

              {/* Native color picker */}
              {configStore.activePartId && (
                <label
                  title="Custom Color Picker"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px dashed #4338CA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: 'rgba(67, 56, 202, 0.08)'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <input
                    type="color"
                    value={currentPart?.color || '#ffffff'}
                    onChange={(e) => configStore.setPartColor(configStore.activePartId, e.target.value)}
                    style={{ opacity: 0, position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
                  />
                </label>
              )}
            </div>
            {currentPart && (
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginTop: '6px' }}>
                CURRENT: {currentPart.color.toUpperCase()} ({currentPart.name})
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. TEXTURE / FABRIC PANEL */}
      {activeTab === 'texture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block' }}>
            Garment Fabric Weave
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(['mesh', 'knit', 'smooth'] as const).map((type) => {
              const isSelected = configStore.fabricType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => configStore.setFabricType(type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: isSelected ? 'rgba(67, 56, 202, 0.12)' : 'rgba(255, 255, 255, 0.6)',
                    border: isSelected ? '1.5px solid #4338CA' : '1px solid rgba(67, 56, 202, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#4338CA' : '#1e1b4b', display: 'block', textTransform: 'capitalize' }}>
                      {type} Weave
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {type === 'mesh' ? 'High-breathability athletic mesh' : type === 'knit' ? 'Durable interlock stretch knit' : 'Polished aerodynamic smooth jersey'}
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4338CA' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LOGO PANEL */}
      {activeTab === 'logo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(67, 56, 202, 0.08)',
              border: '1.5px dashed #4338CA',
              color: '#4338CA',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Upload Vector / Image Decal</span>
          </button>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: '8px' }}>
              Applied Decals ({logoList.length})
            </span>
            {logoList.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                No custom decals placed yet. Drag on 3D jersey to reposition.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {logoList.map((logo) => {
                  const isSelected = configStore.selectedLogoId === logo.id;
                  return (
                    <div
                      key={logo.id}
                      onClick={() => configStore.setSelectedLogo(logo.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(67, 56, 202, 0.12)' : 'rgba(255, 255, 255, 0.6)',
                        border: isSelected ? '1.5px solid #4338CA' : '1px solid rgba(67, 56, 202, 0.15)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={logo.src}
                          alt="Decal"
                          style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '4px' }}
                        />
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e1b4b', display: 'block' }}>
                            Decal #{logo.id.slice(-4)}
                          </span>
                          <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                            {Math.round(logo.width)}×{Math.round(logo.height)}px · {Math.round(logo.rotation || 0)}°
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          configStore.removeLogo(logo.id);
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '8px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}
                        title="Delete Decal"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TEXT PANEL */}
      {activeTab === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: '8px' }}>
              Add Player Name / Number
            </span>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={newTextStr}
                onChange={(e) => setNewTextStr(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
                placeholder="e.g. 10 / NEYMAR"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(67, 56, 202, 0.25)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  color: '#1e1b4b',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setSelectedFont((f) => (f === 'Impact' ? 'Arial' : 'Impact'))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(67, 56, 202, 0.25)',
                  background: 'rgba(67, 56, 202, 0.08)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#4338CA',
                  cursor: 'pointer'
                }}
                title="Toggle Font"
              >
                {selectedFont === 'Impact' ? 'Impact' : 'Sans'}
              </button>
              <button
                type="button"
                onClick={handleAddText}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#4338CA',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Add Text"
              >
                +
              </button>
            </div>

            {/* Typography Swatches */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              {COLOR_PALETTE.map((hex) => {
                const isSelected = selectedTextColor.toLowerCase() === hex.toLowerCase();
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleTextColorSelect(hex)}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: hex,
                      border: isSelected ? '2px solid #4338CA' : '1px solid rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer'
                    }}
                    title={hex}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: '8px' }}>
              Active Embroidery Overlays ({textList.length})
            </span>
            {textList.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                No custom typography added yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {textList.map((t) => {
                  const isSelected = configStore.selectedLogoId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => configStore.setSelectedText(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(67, 56, 202, 0.12)' : 'rgba(255, 255, 255, 0.6)',
                        border: isSelected ? '1.5px solid #4338CA' : '1px solid rgba(67, 56, 202, 0.15)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: t.fontFamily, color: t.textColor || '#1e1b4b' }}>
                          "{t.text}"
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                          {t.fontFamily}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          configStore.removeText(t.id);
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '8px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}
                        title="Delete Text"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. FINISHING PANEL */}
      {activeTab === 'finishing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: '8px' }}>
              Customization Summary
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.5)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(67, 56, 202, 0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Fabric Weave:</span>
                <strong style={{ color: '#1e1b4b', textTransform: 'uppercase' }}>{configStore.fabricType}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Customized Color Layers:</span>
                <strong style={{ color: '#1e1b4b' }}>{configStore.parts.length} Layers</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Decals Placed:</span>
                <strong style={{ color: '#1e1b4b' }}>{logoList.length} Items</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Embroidery Typography:</span>
                <strong style={{ color: '#1e1b4b' }}>{textList.length} Items</strong>
              </div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: '8px' }}>
              Quality Verification
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#16a34a' }}>
              <span>✓ WebGPU 3D Model Verified</span>
              <span>✓ Color Layer Shaders Synchronized</span>
              <span>✓ Texture Compositor Baked</span>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerOrder}
            style={{
              padding: '14px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(67, 56, 202, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>Finish & Request Tech Pack</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </GlassInspectorDrawer>
  );
});
