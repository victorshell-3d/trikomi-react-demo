import React from 'react';
import { observer } from 'mobx-react-lite';
import { useViewerStore, AnimationPlugin, ThreeViewer } from '@trikomi/core';

declare global {
  interface Window {
    __THREE_VIEWER_INSTANCE__?: ThreeViewer;
  }
}

export const AnimationTimeline: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  if (viewerStore.animations.length === 0 || !viewerStore.showAnimationTimeline) {
    return null;
  }

  const activeAnimation = viewerStore.activeAnimationIndex >= 0
    ? viewerStore.animations[viewerStore.activeAnimationIndex]
    : null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '83px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      maxWidth: '90%',
      background: 'rgba(15, 15, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      color: '#fff',
      zIndex: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => viewerStore.setIsAnimationPlaying(!viewerStore.isAnimationPlaying)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          >
            {viewerStore.isAnimationPlaying ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          {/* Reverse Play Toggle Button */}
          <button
            onClick={() => {
              const viewer = viewerStore.viewer as ThreeViewer;
              const animPlugin = viewer?.getPlugin(AnimationPlugin);
              if (animPlugin) {
                // If currently playing, we toggle or restart in reverse
                if (viewerStore.isAnimationPlaying) {
                  animPlugin.playAnimationInReverse(viewerStore.activeAnimationIndex, true);
                } else {
                  viewerStore.setIsAnimationPlaying(true);
                  animPlugin.playAnimationInReverse(viewerStore.activeAnimationIndex, true);
                }
              }
            }}
            title="Play in Reverse"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 21 5 12 19 3 19 21" />
            </svg>
          </button>

          {/* Standard Forward Play Button (Resets target to playAnimation) */}
          <button
            onClick={() => {
              const viewer = viewerStore.viewer as ThreeViewer;
              const animPlugin = viewer?.getPlugin(AnimationPlugin);
              if (animPlugin) {
                viewerStore.setIsAnimationPlaying(true);
                animPlugin.playAnimation(viewerStore.activeAnimationIndex, true);
              }
            }}
            title="Play Forward"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>

          <select
            value={viewerStore.activeAnimationIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              viewerStore.setActiveAnimationIndex(idx);
              const viewer = viewerStore.viewer as ThreeViewer;
              const animPlugin = viewer?.getPlugin(AnimationPlugin);
              if (animPlugin) {
                animPlugin.playAnimation(idx, true);
              }
            }}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '13px'
            }}
          >
            {viewerStore.animations.map((anim, i) => (
              <option key={i} value={i}>{anim.name}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '12px', fontFamily: 'monospace', opacity: 0.7 }}>
          {activeAnimation ? (
            `${viewerStore.animationTime.toFixed(2)}s / ${activeAnimation.duration.toFixed(2)}s`
          ) : '0.00s / 0.00s'}
        </div>
      </div>

      {activeAnimation && (
        <input
          type="range"
          min="0"
          max={activeAnimation.duration}
          step="0.01"
          value={viewerStore.animationTime}
          onChange={(e) => {
            viewerStore.setIsAnimationPlaying(false);
            viewerStore.setAnimationTime(Number(e.target.value));
          }}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#4f8fff'
          }}
        />
      )}
    </div>
  );
});
