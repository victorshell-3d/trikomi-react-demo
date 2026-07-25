import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { configStore } from '../../store/ConfigStore';

const DimensionInput = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  const [localVal, setLocalVal] = useState(value.toString());

  useEffect(() => {
    if (parseFloat(localVal) !== value) {
      setLocalVal(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalVal(newVal);

    const parsed = parseFloat(newVal);
    if (Number.isFinite(parsed) && parsed > 0 && parsed !== value) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(localVal);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setLocalVal(value.toString());
    }
  };

  const adjust = (delta: number) => {
    const next = Math.max(0.1, Math.round((value + delta) * 10) / 10);
    onChange(next);
    setLocalVal(next.toString());
  };

  return (
    <div className="dimension-input-container">
      <button className="dimension-input-btn" onClick={() => adjust(-0.1)}>-</button>
      <input
        type="number"
        step="0.1"
        min="0.1"
        className="dimension-input-field"
        value={localVal}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <button className="dimension-input-btn" onClick={() => adjust(0.1)}>+</button>
    </div>
  );
};

const CoordinateInput = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  const [localVal, setLocalVal] = useState(value.toString());

  useEffect(() => {
    if (parseFloat(localVal) !== value) {
      setLocalVal(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalVal(newVal);

    const parsed = parseFloat(newVal);
    if (Number.isFinite(parsed) && parsed !== value) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(localVal);
    if (!Number.isFinite(parsed)) {
      setLocalVal(value.toString());
    }
  };

  const adjust = (delta: number) => {
    const next = Math.round((value + delta) * 10) / 10;
    onChange(next);
    setLocalVal(next.toString());
  };

  return (
    <div className="dimension-input-container">
      <button className="dimension-input-btn" onClick={() => adjust(-0.5)}>-</button>
      <input
        type="number"
        step="0.5"
        className="dimension-input-field"
        value={localVal}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <button className="dimension-input-btn" onClick={() => adjust(0.5)}>+</button>
    </div>
  );
};

const SelectedNodeEditor = observer(() => {
  const nodeId = configStore.selectedNodeId;
  if (!nodeId) {
    return (
      <div className="control-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', color: 'var(--color-text-muted)' }}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', opacity: 0.5 }}>
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        Select a panel to edit
      </div>
    );
  }
  const layout = configStore.flattenedLayout[nodeId];
  if (!layout) return null;

  const isRotated = (Math.abs(layout.rotation) % 180 === 90);
  const displayWidth = isRotated ? layout.h : layout.w;
  const displayHeight = isRotated ? layout.w : layout.h;

  const onVisualWidthChange = (val: number) => {
    const internalVal = configStore.convertToInternal(val);
    if (isRotated) configStore.updateNodeDimension(nodeId, 'height', internalVal);
    else configStore.updateNodeDimension(nodeId, 'width', internalVal);
  };

  const onVisualHeightChange = (val: number) => {
    const internalVal = configStore.convertToInternal(val);
    if (isRotated) configStore.updateNodeDimension(nodeId, 'width', internalVal);
    else configStore.updateNodeDimension(nodeId, 'height', internalVal);
  };

  const isVisualWidthLinked = isRotated ? false : (nodeId !== configStore.rootNode.id);
  const isVisualHeightLinked = isRotated ? (nodeId !== configStore.rootNode.id) : false;

  return (
    <div className="control-card">
      <div className="control-card-title" style={{ justifyContent: 'space-between' }}>
        <span>Selected: {layout.node.name}</span>
        {layout.node.shapeTemplateId && (
          <button
            onClick={() => configStore.setEditingTemplateId(layout.node.shapeTemplateId!)}
            className="primary-btn"
            style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
          >
            Edit Shape
          </button>
        )}
      </div>

      {nodeId !== configStore.rootNode.id && (
        <>
          <div className="control-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0' }}>
            <label style={{ fontSize: '0.75rem' }}>Shape Style</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <select
                value={layout.node.shapeTemplateId || ''}
                onChange={(e) => {
                  layout.node.shapeTemplateId = e.target.value || undefined;
                }}
                style={{
                  background: '#1f2937',
                  color: 'white',
                  border: '1px solid var(--color-border)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer',
                  maxWidth: '140px'
                }}
              >
                <option value="">Default Flap</option>
                {Object.values(configStore.templates)
                  .filter(t => !t.id.startsWith('temp-hole-'))
                  .map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button
                onClick={() => configStore.createCustomShapeTemplate(nodeId)}
                title="Create Custom Shape"
                style={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid #6366f1',
                  color: '#a5b4fc',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  height: '28px',
                  width: '28px'
                }}
              >
                +
              </button>
            </div>
          </div>
          {layout.node.shapeTemplateId && (
            <div className="toggle-switch-container" style={{ margin: '8px 0 12px 0', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="toggle-switch-label" style={{ fontSize: '0.75rem' }}>Flip Style Horizontally</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={!!layout.node.flipped}
                  onChange={(e) => {
                    configStore.setNodeFlipped(nodeId, e.target.checked);
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          )}
        </>
      )}

      <div className="control-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column' }}>
          <span>Width ({configStore.activeUnit})</span>
          {isVisualWidthLinked && <span style={{ color: 'var(--color-text-muted)', fontSize: '10px', fontStyle: 'italic' }}>Linked</span>}
        </label>
        <DimensionInput
          value={Math.round(displayWidth * 10) / 10}
          onChange={onVisualWidthChange}
        />
      </div>

      <div className="control-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column' }}>
          <span>Height / Length ({configStore.activeUnit})</span>
          {isVisualHeightLinked && <span style={{ color: 'var(--color-text-muted)', fontSize: '10px', fontStyle: 'italic' }}>Linked</span>}
        </label>
        <DimensionInput
          value={Math.round(displayHeight * 10) / 10}
          onChange={onVisualHeightChange}
        />
      </div>

      <div className="control-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <label style={{ fontSize: '0.75rem' }}>Panel Color</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={layout.node.color || '#ffffff'}
            onChange={(e) => { configStore.setNodeColor(nodeId, e.target.value); }}
            style={{ padding: '0', height: '28px', width: '36px', border: 'none', background: 'transparent', cursor: 'pointer', outline: 'none' }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{layout.node.color || '#ffffff'}</span>
        </div>
      </div>

      {nodeId !== configStore.rootNode.id && (
        <button
          onClick={() => configStore.deleteNode(nodeId)}
          style={{
            marginTop: '6px',
            background: 'rgba(239, 68, 68, 0.06)',
            borderColor: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            width: '100%',
            fontSize: '11px',
            padding: '6px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)'; }}
        >
          Delete Panel
        </button>
      )}
    </div>
  );
});

const CutoutEditorCard = observer(() => {
  const nodeId = configStore.selectedNodeId;
  if (!nodeId) return null;
  
  const layout = configStore.flattenedLayout[nodeId];
  if (!layout) return null;

  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Cutouts & Holes
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button className="secondary-btn" onClick={() => configStore.addHole(nodeId, 'circle')} style={{ flex: 1, padding: '4px', fontSize: '11px' }}>+ Circle</button>
        <button className="secondary-btn" onClick={() => configStore.addHole(nodeId, 'rectangle')} style={{ flex: 1, padding: '4px', fontSize: '11px' }}>+ Rect</button>
        <button className="secondary-btn" onClick={() => configStore.addHole(nodeId, 'euro-hole')} style={{ flex: 1, padding: '4px', fontSize: '11px' }}>+ Euro</button>
        <button className="secondary-btn" onClick={() => configStore.addHole(nodeId, 'custom')} style={{ flex: 1, padding: '4px', fontSize: '11px' }}>+ Custom</button>
      </div>

      {layout.node.holes && layout.node.holes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {layout.node.holes.map((hole: Record<string, unknown> | string | number | boolean, i: number) => (
            <div key={hole.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{hole.type} Hole</span>
                
                {hole.type === 'custom' && hole.shapeTemplateId && (
                  <button
                    onClick={() => configStore.setEditingTemplateId(hole.shapeTemplateId!)}
                    className="primary-btn"
                    style={{ padding: '2px 6px', fontSize: '10px', borderRadius: '4px' }}
                  >
                    Edit Shape
                  </button>
                )}

                <button 
                  onClick={() => configStore.removeHole(nodeId, hole.id)}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                >
                  Remove
                </button>
              </div>
              
              {hole.type === 'custom' && (
                <div className="control-group" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '10px' }}>Shape Template</label>
                  <select
                    value={hole.shapeTemplateId || ''}
                    onChange={(e) => {
                      configStore.updateHole(nodeId, hole.id, { shapeTemplateId: e.target.value || undefined });
                    }}
                    style={{
                      background: '#1f2937', color: 'white', border: '1px solid var(--color-border)',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', outline: 'none',
                      cursor: 'pointer', width: '100%'
                    }}
                  >
                    <option value="">Select Template</option>
                    {Object.values(configStore.templates)
                      .filter(t => t.id.startsWith('temp-hole-'))
                      .map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="control-group">
                  <label style={{ fontSize: '10px' }}>Offset X</label>
                  <CoordinateInput value={hole.x} onChange={v => configStore.updateHole(nodeId, hole.id, { x: v })} />
                </div>
                <div className="control-group">
                  <label style={{ fontSize: '10px' }}>Offset Y</label>
                  <CoordinateInput value={hole.y} onChange={v => configStore.updateHole(nodeId, hole.id, { y: v })} />
                </div>
                {hole.type === 'circle' ? (
                  <div className="control-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '10px' }}>Radius</label>
                    <DimensionInput value={hole.radius} onChange={v => configStore.updateHole(nodeId, hole.id, { radius: v })} />
                  </div>
                ) : (
                  <>
                    <div className="control-group">
                      <label style={{ fontSize: '10px' }}>Width</label>
                      <DimensionInput value={hole.width} onChange={v => configStore.updateHole(nodeId, hole.id, { width: v })} />
                    </div>
                    <div className="control-group">
                      <label style={{ fontSize: '10px' }}>Height</label>
                      <DimensionInput value={hole.height} onChange={v => configStore.updateHole(nodeId, hole.id, { height: v })} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>
          No cutouts added yet.
        </div>
      )}
    </div>
  );
});

const AnglesTimelineEditor = observer(() => {
  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Angles & Timeline
      </div>
      <div className="control-group" style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <label>Folding Progress (0 to 1)</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={configStore.unfoldProgress}
          onChange={e => configStore.setUnfoldProgress(parseFloat(e.target.value))}
        />
      </div>
      <div className="angle-list">
        {Object.values(configStore.flattenedLayout)
          .sort((a, b) => a.node.name.localeCompare(b.node.name))
          .map(({ node }) => (
          <div key={node.id} className="angle-row">
            <span className="angle-row-name" title={node.name}>
              {node.name}
            </span>

            <div className="angle-row-inputs">
              {/* Angle */}
              <div className="angle-row-input-group">
                <span>A:</span>
                <input
                  type="number"
                  value={node.foldedAngle}
                  onChange={e => { node.foldedAngle = parseFloat(e.target.value) || 0; }}
                />
              </div>

              {/* Start */}
              <div className="angle-row-input-group">
                <span>S:</span>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={node.animStart ?? 0}
                  onChange={e => { node.animStart = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)); }}
                />
              </div>

              {/* End */}
              <div className="angle-row-input-group">
                <span>E:</span>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={node.animEnd ?? 1}
                  onChange={e => { node.animEnd = Math.max(0, Math.min(1, parseFloat(e.target.value) || 1)); }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const MasterTimelineEditor = observer(() => {
  const [globalStart, setGlobalStart] = useState(0);
  const [globalEnd, setGlobalEnd] = useState(1);

  const handleGlobalStartChange = (val: number) => {
    setGlobalStart(val);
    configStore.setGlobalAnimationTiming(val, globalEnd);
  };

  const handleGlobalEndChange = (val: number) => {
    setGlobalEnd(val);
    configStore.setGlobalAnimationTiming(globalStart, val);
  };

  return (
    <div className="control-card">
      <div className="control-card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        Master Timeline Editor
      </div>
      <div className="control-group">
        <label>Global Animation Sequence</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Start</span>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={globalStart}
              onChange={e => handleGlobalStartChange(parseFloat(e.target.value) || 0)}
            />
          </div>
          <span style={{ color: 'var(--color-text-muted)' }}>→</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>End</span>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={globalEnd}
              onChange={e => handleGlobalEndChange(parseFloat(e.target.value) || 1)}
            />
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
          Applies proportional animation timing to all panels based on hierarchy.
        </div>
      </div>
    </div>
  );
});

export const StructureTab = observer(() => {
  return (
    <>
      <SelectedNodeEditor />
      <CutoutEditorCard />
      <AnglesTimelineEditor />
      <MasterTimelineEditor />
    </>
  );
});
