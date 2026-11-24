import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { GlassInspectorDrawer } from '@trikomi/ui-kit';

export interface RingOption {
  name: string;
  url: string;
  thumb: string;
}

export interface MetalOption {
  name: string;
  alloy: string;
  hex: string;
  priceModifier: number;
}

export const PRECIOUS_METALS: MetalOption[] = [
  { name: 'Yellow Gold', alloy: '18K Yellow Gold', hex: '#d4af37', priceModifier: 650 },
  { name: 'White Gold', alloy: '18K White Gold', hex: '#e2e8f0', priceModifier: 700 },
  { name: 'Rose Gold', alloy: '18K Rose Gold', hex: '#b76e79', priceModifier: 680 },
  { name: 'Platinum', alloy: 'Platinum 950', hex: '#cbd5e1', priceModifier: 1100 }
];

interface JewelryInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  rings: RingOption[];
  activeRingIndex: number;
  onSelectRing: (index: number) => void;
  diamondThumbs: Record<string, string>;
  activeShape: string | undefined;
  onSelectShape: (shapeName: string) => void;
  zRotation: number;
  onRotationChange: (val: number, isFinal: boolean) => void;
  scale: number;
  onScaleChange: (val: number, isFinal: boolean) => void;
  yOffset: number;
  onYOffsetChange: (val: number, isFinal: boolean) => void;
  selectedMetal: MetalOption;
  onSelectMetal: (metal: MetalOption) => void;
  isBloomActive?: boolean;
  onToggleBloom?: () => void;
  onResetView?: () => void;
  onExportGLTF?: () => void;
  className?: string;
}

export const JewelryInspector: React.FC<JewelryInspectorProps> = observer(({
  isOpen = true,
  onClose,
  activeTab = 'rings',
  onTabChange,
  rings,
  activeRingIndex,
  onSelectRing,
  diamondThumbs,
  activeShape,
  onSelectShape,
  zRotation,
  onRotationChange,
  scale,
  onScaleChange,
  yOffset,
  onYOffsetChange,
  selectedMetal,
  onSelectMetal,
  isBloomActive = true,
  onToggleBloom,
  onResetView,
  onExportGLTF,
  className = ''
}) => {
  const currentRing = rings[activeRingIndex] || rings[0];
  const diamondCutCount = Object.keys(diamondThumbs).length;

  const tabs = [
    { id: 'rings', label: `Setting (${rings.length})` },
    { id: 'gemstones', label: `Diamond (${diamondCutCount || 10})` },
    { id: 'metals', label: 'Metals' },
    { id: 'optics', label: 'Optics' },
    { id: 'summary', label: 'Price' }
  ];

  // Dynamic pricing algorithm based on carat scale, diamond cut, and metal alloy
  const estimatedPrice = useMemo(() => {
    const baseSettingPrice = activeRingIndex === 0 ? 1950 : 2550; // Solitaire vs Halo
    const metalPrice = selectedMetal?.priceModifier || 650;
    const caratMultiplier = (scale / 100) ** 1.8;
    const centerStonePrice = Math.round(1800 * caratMultiplier);
    return baseSettingPrice + metalPrice + centerStonePrice;
  }, [activeRingIndex, selectedMetal, scale]);

  const estimatedCarat = ((scale / 100) * 1.25).toFixed(2);

  return (
    <GlassInspectorDrawer
      title="Jewelry Studio"
      subtitle={currentRing?.name || 'Bespoke Diamond Customizer'}
      isOpen={isOpen}
      onClose={onClose}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      side="right"
      width={360}
      className={`vs-jewelry-inspector ${className}`.trim()}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
            onClick={onResetView}
          >
            ↺ Reset View
          </button>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
            onClick={onExportGLTF}
          >
            📦 Export 3D
          </button>
        </div>
      }
    >
      <div className="vs-jewelry-inspector-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Tab 1: Ring Settings */}
        {activeTab === 'rings' && (
          <div className="vs-jewelry-rings-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Ring Setting ({rings.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {rings.map((ring, idx) => {
                const isActive = activeRingIndex === idx;
                return (
                  <div
                    key={ring.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectRing(idx)}
                    className={`vs-jewelry-card ${isActive ? 'is-active' : ''}`}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      background: isActive ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isActive ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: '10px',
                        padding: '4px'
                      }}
                    >
                      {ring.thumb ? (
                        <img
                          src={ring.thumb}
                          alt={ring.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>💍</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                        {ring.name}
                      </div>
                      {isActive && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--vs-primary)', fontWeight: 700 }}>
                          Active Setting
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Gemstones & Diamond Cuts */}
        {activeTab === 'gemstones' && (
          <div className="vs-jewelry-gemstones-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Center Stone Cut & Geometry
            </div>
            
            {/* Cut Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {Object.entries(diamondThumbs).map(([shapeName, path]) => {
                const isActive = activeShape === shapeName;
                const imgSrc = (path as string).startsWith('/') ? (path as string).slice(1) : path;
                return (
                  <button
                    key={shapeName}
                    type="button"
                    onClick={() => onSelectShape(shapeName)}
                    title={shapeName}
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '8px',
                      background: isActive ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isActive ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img
                      src={`${(import.meta as any)?.env?.BASE_URL || '/'}${imgSrc}`}
                      alt={shapeName}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Geometry Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
              {/* Scale / Carat Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--vs-ink-muted)' }}>Diamond Scale (Carat Equiv.)</span>
                  <span style={{ fontWeight: 700, color: 'var(--vs-ink)' }}>~{estimatedCarat} ct ({scale}%)</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="1"
                  value={scale}
                  onChange={(e) => onScaleChange(parseInt(e.target.value), false)}
                  onMouseUp={(e) => onScaleChange(parseInt((e.target as HTMLInputElement).value), true)}
                  onTouchEnd={(e) => onScaleChange(parseInt((e.target as HTMLInputElement).value), true)}
                  className="vs-range-slider"
                  style={{ width: '100%', accentColor: 'var(--vs-primary)' }}
                />
              </div>

              {/* Rotation Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--vs-ink-muted)' }}>Orientation Angle</span>
                  <span style={{ fontWeight: 700, color: 'var(--vs-ink)' }}>{zRotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={zRotation}
                  onChange={(e) => onRotationChange(parseInt(e.target.value), false)}
                  onMouseUp={(e) => onRotationChange(parseInt((e.target as HTMLInputElement).value), true)}
                  onTouchEnd={(e) => onRotationChange(parseInt((e.target as HTMLInputElement).value), true)}
                  className="vs-range-slider"
                  style={{ width: '100%', accentColor: 'var(--vs-primary)' }}
                />
              </div>

              {/* Height Offset Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--vs-ink-muted)' }}>Setting Height Offset</span>
                  <span style={{ fontWeight: 700, color: 'var(--vs-ink)' }}>{yOffset}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={yOffset}
                  onChange={(e) => onYOffsetChange(parseInt(e.target.value), false)}
                  onMouseUp={(e) => onYOffsetChange(parseInt((e.target as HTMLInputElement).value), true)}
                  onTouchEnd={(e) => onYOffsetChange(parseInt((e.target as HTMLInputElement).value), true)}
                  className="vs-range-slider"
                  style={{ width: '100%', accentColor: 'var(--vs-primary)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Precious Metals */}
        {activeTab === 'metals' && (
          <div className="vs-jewelry-metals-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Precious Metal Alloy & Band
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PRECIOUS_METALS.map((metal) => {
                const isSelected = selectedMetal.name === metal.name;
                return (
                  <button
                    key={metal.name}
                    type="button"
                    onClick={() => onSelectMetal(metal)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isSelected ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: metal.hex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'inline-block',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                      />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                          {metal.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                          {metal.alloy}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--vs-primary)', fontWeight: 700 }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Studio Optics & Lighting */}
        {activeTab === 'optics' && (
          <div className="vs-jewelry-optics-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Optical Dispersion & Post-Processing
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                  Diamond Bloom Shimmer
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                  Specular glint & refractive dispersion
                </div>
              </div>
              <input
                type="checkbox"
                checked={isBloomActive}
                onChange={onToggleBloom}
              />
            </label>

            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.55)',
                fontSize: '0.75rem',
                color: 'var(--vs-ink-muted)',
                lineHeight: '1.5'
              }}
            >
              Diamond material uses real-time WebGPU spectral dispersion shaders simulating internal light bounce, refraction index (IOR 2.42), and chromatic aberration.
            </div>
          </div>
        )}

        {/* Tab 5: Summary & Real-Time Price */}
        {activeTab === 'summary' && (
          <div className="vs-jewelry-summary-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Bespoke Ring Specification
            </div>

            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Setting Style:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>{currentRing.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Center Diamond:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>
                  {activeShape || 'Round Brilliant'} (~{estimatedCarat} ct)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Precious Metal:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>{selectedMetal.alloy}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Clarity & Cut:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>VVS1 • Ideal Cut</span>
              </div>
              
              <div style={{ height: '1px', background: 'rgba(0, 0, 0, 0.08)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink-muted)' }}>
                  Estimated Price:
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--vs-primary)' }}>
                  ${estimatedPrice.toLocaleString()} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              className="vs-btn vs-btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              onClick={() => {
                alert(`Order inquiry created for ${currentRing.name} with ${selectedMetal.alloy} and ${estimatedCarat}ct diamond at $${estimatedPrice.toLocaleString()} USD.`);
              }}
            >
              Reserve Ring / Request Consultation
            </button>
          </div>
        )}
      </div>
    </GlassInspectorDrawer>
  );
});

export default JewelryInspector;