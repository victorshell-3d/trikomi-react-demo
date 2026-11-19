import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useViewerStore } from '@trikomi/core';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { MaterialEditor } from './components/MaterialEditor';
import { AnimationTimeline } from './components/AnimationTimeline';
import { CameraViews } from './components/CameraViews';
import { MeasurementOverlay } from './components/MeasurementOverlay';
import { DiamondExtractor } from './components/DiamondExtractor';
import { ViewerLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';

const App = observer(() => {
  const viewerStore = useViewerStore();
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleExitAR = () => {
    if (typeof window !== 'undefined' && window.__SLAM_SDK_INSTANCE__) {
      window.__SLAM_SDK_INSTANCE__.stop();
    }
    viewerStore.setIsArActive(false);
  };

  const isDemo = route.includes('demo') || route.includes('viewer') || route === '#/diamond-extractor';

  return (
    <VictorShellThemeProvider initialAccent="indigo">
      {!isDemo ? (
        <ViewerLandingPage
          onExploreDemo={() => {
            window.location.hash = '#demo';
          }}
          exploreDemoHref="#demo"
          theme="indigo"
        />
      ) : (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
          {/* Back to Product Landing Page button */}
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/';
            }}
            title="Back to Product Landing Page"
            style={{
              position: 'absolute',
              top: '20px',
              left: viewerStore.isArActive ? '180px' : '20px',
              zIndex: 9998,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '30px',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Overview</span>
          </button>

          {/* 8thAR Floating Back Overlay */}
          {viewerStore.isArActive && (
            <button
              className="ar-back-btn"
              onClick={handleExitAR}
              title="Exit AR and return to standard 3D Viewer"
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '30px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to 3D View</span>
            </button>
          )}

          {/* 3D Canvas Viewport */}
          <main style={{ width: '100%', height: '100%', position: 'relative' }}>
            <ThreeCanvas />
          </main>

          {route === '#/diamond-extractor' ? (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflowY: 'auto', pointerEvents: 'none', background: 'transparent' }}>
              <DiamondExtractor />
            </div>
          ) : (
            <>
              {/* Floating UI Layers */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto' }}>
                  <Sidebar />
                  <CameraViews />
                  <Toolbar />
                  <MaterialEditor />
                  <AnimationTimeline />
                </div>
                <MeasurementOverlay />
              </div>

              {/* Mobile-only sidebar toggle button */}
              {!viewerStore.isArActive && (
                <button
                  className={`mobile-toggle-btn${viewerStore.showSidebar ? ' active' : ''}`}
                  onClick={() => viewerStore.setShowSidebar(!viewerStore.showSidebar)}
                  aria-label="Toggle controls"
                >
                  {viewerStore.showSidebar ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </VictorShellThemeProvider>
  );
});

export default App;
