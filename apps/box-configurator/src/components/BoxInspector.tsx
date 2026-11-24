import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { GlassInspectorDrawer } from '@trikomi/ui-kit';
import { configStore } from '../store/ConfigStore';
import { CenterModelPlugin, ExportPlugin } from '@trikomi/core';

export interface BoxInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export const MATERIAL_PATTERNS = [
  { id: 'kraft', name: 'Natural Kraft Cardboard', hex: '#c89d7c', desc: '100% recycled unbleached fiber' },
  { id: 'none', name: 'Solid White Coated', hex: '#f8fafc', desc: 'Premium bleached SBS paperboard' },
  { id: 'grid', name: 'Blueprint Technical Grid', hex: '#38bdf8', desc: 'Precision engineering grid overlay' },
  { id: 'dots', name: 'Polka Dots Minimal', hex: '#e2e8f0', desc: 'Decorative geometric dot pattern' },
  { id: 'stripes', name: 'Diagonal Stripes', hex: '#cbd5e1', desc: 'Modern diagonal safety stripes' }
];

export const PRESET_COLORS = [
  { name: 'Natural Kraft', hex: '#c89d7c' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Matte Charcoal', hex: '#27272a' },
  { name: 'Indigo Navy', hex: '#1e1b4b' },
  { name: 'Forest Green', hex: '#14532d' },
  { name: 'Crimson Wine', hex: '#831843' }
];

export const BoxInspector: React.FC<BoxInspectorProps> = observer(({
  isOpen = true,
  onClose,
  activeTab = 'style',
  onTabChange,
  className = ''
}) => {
  const currentTemplate = configStore.boxTemplates.find(b => b.id === configStore.activeBoxTemplateId) || configStore.boxTemplates[0];

  const tabs = [
    { id: 'style', label: `Style (${configStore.boxTemplates.length})` },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'materials', label: 'Materials' },
    { id: 'dieline', label: 'Dieline' },
    { id: 'summary', label: 'Summary' }
  ];

  // Selected node in dieline/3D structure
  const selectedNode = configStore.selectedNodeId ? configStore.findNode(configStore.selectedNodeId) : null;
  const selectedLayout = configStore.selectedNodeId ? configStore.flattenedLayout[configStore.selectedNodeId] : null;

  // Root node display dimensions
  const rootLayout = configStore.flattenedLayout[configStore.rootNode.id];
  const rootWidth = rootLayout ? configStore.convertToDisplay(rootLayout.w) : 0;
  const rootHeight = rootLayout ? configStore.convertToDisplay(rootLayout.h) : 0;

  // Calculate estimated unit price based on blank surface area and material grade
  const estimatedCost = useMemo(() => {
    const bounds = configStore.layoutBounds;
    const blankWidthIn = bounds.maxX - bounds.minX;
    const blankHeightIn = bounds.maxY - bounds.minY;
    const squareInches = Math.max(10, blankWidthIn * blankHeightIn);
    
    // Base cost: $0.0035 per sq inch for kraft, $0.0050 for coated white
    const materialRate = configStore.activePattern === 'none' ? 0.0050 : 0.0038;
    const baseMaterialCost = squareInches * materialRate;
    const baseToolingUnit = 0.35; // die-cut press per unit amortized
    const unitTotal = Math.max(0.50, Math.round((baseMaterialCost + baseToolingUnit) * 100) / 100);
    return unitTotal;
  }, [configStore.layoutBounds, configStore.activePattern]);

  const handleResetView = () => {
    const viewer = configStore.viewerInstance;
    if (viewer) {
      const centerPlugin = viewer.getPlugin(CenterModelPlugin);
      if (centerPlugin) {
        centerPlugin.center(viewer.scene);
      }
    }
  };

  const handleExportGLTF = () => {
    configStore.export3DGLTF();
  };

  const handleExportSVG = () => {
    configStore.exportDielineToSVG();
  };

  return (
    <GlassInspectorDrawer
      title="Box Studio"
      subtitle={currentTemplate?.name || 'Parametric Packaging'}
      isOpen={isOpen}
      onClose={onClose}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      side="right"
      width={360}
      className={`vs-box-inspector ${className}`.trim()}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
            onClick={handleResetView}
            title="Recenter 3D View"
          >
            ↺ Recenter
          </button>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
            onClick={handleExportSVG}
            title="Download Vector SVG Dieline"
          >
            ✂️ SVG Dieline
          </button>
          <button
            type="button"
            className="vs-btn vs-btn-primary"
            style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
            onClick={handleExportGLTF}
            title="Export 3D GLTF"
          >
            📦 3D GLTF
          </button>
        </div>
      }
    >
      <div className="vs-box-inspector-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* TAB 1: STYLE */}
        {activeTab === 'style' && (
          <div className="vs-box-style-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Packaging Style ({configStore.boxTemplates.length})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px' }}>
              {configStore.boxTemplates.map((template) => {
                const isActive = configStore.activeBoxTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => configStore.loadBoxTemplate(template.id)}
                    className={`vs-box-style-card ${isActive ? 'is-active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px',
                      borderRadius: '12px',
                      background: isActive ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isActive ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: isActive ? 'var(--vs-primary)' : 'rgba(0, 0, 0, 0.05)',
                          color: isActive ? '#ffffff' : 'var(--vs-ink)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem'
                        }}
                      >
                        📦
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                          {template.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--vs-ink-muted)', marginTop: '2px' }}>
                          Parametric carton with auto-creasing
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--vs-primary)',
                          background: 'rgba(99, 102, 241, 0.12)',
                          padding: '4px 8px',
                          borderRadius: '999px'
                        }}
                      >
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DIMENSIONS */}
        {activeTab === 'dimensions' && (
          <div className="vs-box-dimensions-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Unit System Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Unit System
              </div>
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.06)', padding: '2px', borderRadius: '8px' }}>
                {(['in', 'mm', 'cm'] as const).map((unit) => {
                  const isUnitActive = configStore.activeUnit === unit;
                  return (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => configStore.setUnit(unit)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: isUnitActive ? 'var(--vs-primary)' : 'transparent',
                        color: isUnitActive ? '#ffffff' : 'var(--vs-ink)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {unit.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Base Box Dimensions */}
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--vs-ink)' }}>
                Base Face Dimensions ({configStore.activeUnit.toUpperCase()})
              </div>

              {/* Base Width */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--vs-ink-muted)' }}>Main Panel Width:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = configStore.convertToDisplay(rootWidth);
                      const next = Math.max(0.5, cur - 0.5);
                      configStore.updateNodeDimension(configStore.rootNode.id, 'width', configStore.convertToInternal(next));
                    }}
                    className="vs-btn vs-btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 700, color: 'var(--vs-ink)', minWidth: '55px', textAlign: 'center', fontSize: '0.85rem' }}>
                    {rootWidth.toFixed(1)} {configStore.activeUnit}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = configStore.convertToDisplay(rootWidth);
                      const next = cur + 0.5;
                      configStore.updateNodeDimension(configStore.rootNode.id, 'width', configStore.convertToInternal(next));
                    }}
                    className="vs-btn vs-btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Base Height */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--vs-ink-muted)' }}>Main Panel Height:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = configStore.convertToDisplay(rootHeight);
                      const next = Math.max(0.5, cur - 0.5);
                      configStore.updateNodeDimension(configStore.rootNode.id, 'height', configStore.convertToInternal(next));
                    }}
                    className="vs-btn vs-btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 700, color: 'var(--vs-ink)', minWidth: '55px', textAlign: 'center', fontSize: '0.85rem' }}>
                    {rootHeight.toFixed(1)} {configStore.activeUnit}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = configStore.convertToDisplay(rootHeight);
                      const next = cur + 0.5;
                      configStore.updateNodeDimension(configStore.rootNode.id, 'height', configStore.convertToInternal(next));
                    }}
                    className="vs-btn vs-btn-secondary"
                    style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Panel Detail */}
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: selectedNode ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.35)',
                border: selectedNode ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--vs-ink)' }}>
                  {selectedNode ? `Panel: ${selectedNode.name}` : 'Panel Selection'}
                </div>
                {selectedNode && selectedNode.shapeTemplateId && (
                  <button
                    type="button"
                    onClick={() => configStore.setEditingTemplateId(selectedNode.shapeTemplateId!)}
                    className="vs-btn vs-btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  >
                    Edit Flap Path
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--vs-ink-muted)' }}>
                {selectedNode && selectedLayout
                  ? `Dimensions: ${configStore.convertToDisplay(selectedLayout.w).toFixed(1)} × ${configStore.convertToDisplay(selectedLayout.h).toFixed(1)} ${configStore.activeUnit}`
                  : 'Click on any face in the 2D Dieline or 3D model to edit its individual dimensions or flap profile.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MATERIALS */}
        {activeTab === 'materials' && (
          <div className="vs-box-materials-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Paperboard Material Finish ({MATERIAL_PATTERNS.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {MATERIAL_PATTERNS.map((pattern) => {
                const isSelected = configStore.activePattern === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    type="button"
                    onClick={() => configStore.setActivePattern(pattern.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                      border: isSelected ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: pattern.hex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'inline-block',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                          {pattern.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                          {pattern.desc}
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

            {/* Global Paint Color Swatches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Base Board Hue
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {PRESET_COLORS.map((preset) => {
                  const isColorActive = configStore.rootNode.color?.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => configStore.setGlobalBoxColor(preset.hex)}
                      title={preset.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: preset.hex,
                        border: isColorActive ? '2px solid var(--vs-primary)' : '1px solid rgba(0,0,0,0.2)',
                        boxShadow: isColorActive ? '0 0 0 2px var(--vs-tonal-lavender)' : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIELINE */}
        {activeTab === 'dieline' && (
          <div className="vs-box-dieline-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Parametric Folding & Layout
            </div>

            {/* Unfold Slider */}
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>Unfold Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--vs-primary)' }}>
                  {Math.round(configStore.unfoldProgress * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(configStore.unfoldProgress * 100)}
                onChange={(e) => configStore.setUnfoldProgress(parseInt(e.target.value) / 100)}
                className="vs-range-slider"
                style={{ width: '100%', accentColor: 'var(--vs-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                <span>0% (Folded 3D Box)</span>
                <span>100% (Flat Dieline)</span>
              </div>
            </div>

            {/* Measurement Annotations Toggle */}
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
                  Show Dimension Annotations
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                  Display length & crease measurements on 2D dieline
                </div>
              </div>
              <input
                type="checkbox"
                checked={configStore.showMeasurements}
                onChange={() => configStore.setShowMeasurements(!configStore.showMeasurements)}
              />
            </label>

            {/* Dieline Visual Guide */}
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.55)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.75rem',
                color: 'var(--vs-ink-muted)'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--vs-ink)', marginBottom: '2px' }}>
                Dieline Legend:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '2px', background: '#dc2626', display: 'inline-block' }} />
                <span>Solid Red: Outer Die-Cut Perimeter Line</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '2px', borderTop: '2px dashed #2563eb', display: 'inline-block' }} />
                <span>Dashed Blue: Scoring & Crease Fold Line</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SUMMARY */}
        {activeTab === 'summary' && (
          <div className="vs-box-summary-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Packaging Specifications & Pricing
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
                <span style={{ color: 'var(--vs-ink-muted)' }}>Box Style:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>{currentTemplate.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Material Grade:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>
                  {MATERIAL_PATTERNS.find(p => p.id === configStore.activePattern)?.name || 'Natural Kraft'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Main Panel Face:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>
                  {rootWidth.toFixed(1)} × {rootHeight.toFixed(1)} {configStore.activeUnit}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--vs-ink-muted)' }}>Flat Dieline Bounds:</span>
                <span style={{ fontWeight: 600, color: 'var(--vs-ink)' }}>
                  {(configStore.layoutBounds.maxX - configStore.layoutBounds.minX).toFixed(1)} × {(configStore.layoutBounds.maxY - configStore.layoutBounds.minY).toFixed(1)} in
                </span>
              </div>

              <div style={{ height: '1px', background: 'rgba(0, 0, 0, 0.08)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink-muted)' }}>
                  Est. Unit Cost (MOQ 500):
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--vs-primary)' }}>
                  ${estimatedCost.toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              className="vs-btn vs-btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              onClick={() => {
                alert(`Sample inquiry created for ${currentTemplate.name} at estimated $${estimatedCost.toFixed(2)} USD per unit.`);
              }}
            >
              Request Production Sample & Quote
            </button>
          </div>
        )}

      </div>
    </GlassInspectorDrawer>
  );
});

export default BoxInspector;
