import React from 'react';
import { GlassInspectorDrawer } from '@trikomi/ui-kit';

export const TourInspector = ({
  isOpen = true,
  onClose,
  tourData,
  currentScene,
  currentSceneId,
  onSelectScene,
  activeTab = 'scenes',
  onTabChange,
  isMuted = true,
  onToggleMute,
  isAutoRotate = false,
  onToggleAutoRotate,
  className = ''
}) => {
  const scenes = tourData?.scenes || [];
  const hotspots = currentScene?.hotspots || [];
  const shapes = currentScene?.shapes || [];
  const audioPoints = currentScene?.audio_points || [];

  const tabs = [
    { id: 'scenes', label: `Scenes (${scenes.length})` },
    { id: 'hotspots', label: `Hotspots (${hotspots.length})` },
    { id: 'shapes', label: `Media (${shapes.length})` },
    { id: 'audio', label: 'Audio' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <GlassInspectorDrawer
      title="360° Tour Explorer"
      subtitle={tourData?.title || 'Virtual Tour Experience'}
      isOpen={isOpen}
      onClose={onClose}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      side="right"
      width={360}
      className={`vs-tour-inspector ${className}`.trim()}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
            onClick={onToggleMute}
          >
            {isMuted ? '🔊 Unmute Tour' : '🔇 Mute Sound'}
          </button>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
            onClick={onToggleAutoRotate}
          >
            {isAutoRotate ? '⏹ Stop Rotate' : '🔄 Auto-Rotate'}
          </button>
        </div>
      }
    >
      <div className="vs-tour-inspector-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Tab 1: Scenes Catalog */}
        {activeTab === 'scenes' && (
          <div className="vs-tour-scenes-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tour Locations ({scenes.length})
            </div>
            {scenes.map((scene) => {
              const isActive = scene.id === currentSceneId;
              return (
                <div
                  key={scene.id}
                  onClick={() => onSelectScene && onSelectScene(scene)}
                  role="button"
                  tabIndex={0}
                  className={`vs-tour-scene-card ${isActive ? 'is-active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: isActive ? 'var(--vs-tonal-lavender)' : 'rgba(255, 255, 255, 0.45)',
                    border: isActive ? '1px solid var(--vs-primary)' : '1px solid rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}
                  >
                    📍
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {scene.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                      {(scene.hotspots || []).length} hotspots • {(scene.shapes || []).length} shapes
                    </div>
                  </div>
                  {isActive && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--vs-primary)', textTransform: 'uppercase' }}>
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Hotspots */}
        {activeTab === 'hotspots' && (
          <div className="vs-tour-hotspots-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Interactive Hotspots in {currentScene?.name || 'Scene'}
            </div>
            {hotspots.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--vs-ink-muted)', fontSize: '0.8rem' }}>
                No transition hotspots in this scene.
              </div>
            ) : (
              hotspots.map((hs, idx) => {
                const targetScene = scenes.find((s) => s.id === hs.targetSceneId);
                return (
                  <div
                    key={hs.id || idx}
                    onClick={() => targetScene && onSelectScene && onSelectScene(targetScene)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.65)',
                      cursor: targetScene ? 'pointer' : 'default'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                        {hs.label || `Hotspot #${idx + 1}`}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                        Target: {targetScene?.name || hs.targetSceneId || 'Next Scene'}
                      </div>
                    </div>
                    {targetScene && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--vs-primary)' }}>➔</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Shapes & Media Overlays */}
        {activeTab === 'shapes' && (
          <div className="vs-tour-shapes-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Media Shapes & Embedded Elements
            </div>
            {shapes.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--vs-ink-muted)', fontSize: '0.8rem' }}>
                No polygonal media shapes attached to this scene.
              </div>
            ) : (
              shapes.map((sh, idx) => (
                <div
                  key={sh.id || idx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.65)'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                    {sh.name || `Shape #${idx + 1}`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                    Action: {sh.actionType || 'show_image'} • Type: {sh.type || 'polygon'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Spatial Audio */}
        {activeTab === 'audio' && (
          <div className="vs-tour-audio-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Spatial Audio Sources
            </div>
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>
                  Audio Playback
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>
                  {isMuted ? 'Muted' : 'Playing spatial & ambient track'}
                </div>
              </div>
              <button
                type="button"
                className="vs-btn vs-btn-sm vs-btn-secondary"
                onClick={onToggleMute}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--vs-ink-muted)', marginTop: '4px' }}>
              Audio points in current scene: {audioPoints.length}
            </div>
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'settings' && (
          <div className="vs-tour-settings-view" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--vs-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Viewer Configuration
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.65)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--vs-ink)' }}>Auto-Rotate</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--vs-ink-muted)' }}>Continuous 360° rotation</div>
              </div>
              <button
                type="button"
                className="vs-btn vs-btn-sm vs-btn-secondary"
                onClick={onToggleAutoRotate}
              >
                {isAutoRotate ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
        )}
      </div>
    </GlassInspectorDrawer>
  );
};
export default TourInspector;
