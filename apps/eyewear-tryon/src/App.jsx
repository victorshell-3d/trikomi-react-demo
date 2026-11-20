import { useState, useEffect } from 'react';
import './App.css';
import MediaSelector from './MediaSelector';
import { EyewearLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => window.location.hash || '#/');
  const [guidanceDismissed, setGuidanceDismissed] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Always hide spinner initially
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'none';
  }, []);

  const isDemo = currentRoute.includes('demo');

  return (
    <VictorShellThemeProvider initialAccent="violet">
      {!isDemo ? (
        <EyewearLandingPage
          onExploreDemo={() => {
            window.location.hash = '#demo';
          }}
          exploreDemoHref="#demo"
          theme="violet"
        />
      ) : (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: 'var(--bg-color)' }}>
          {/* Back to landing page navigation pill */}
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 9999 }}>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                color: '#1A162B',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(110, 44, 242, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back to Overview</span>
            </button>
          </div>

          {/* Webcam & Rotation Guidance Pill */}
          {!guidanceDismissed && (
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 9998,
                maxWidth: 'min(420px, calc(100vw - 200px))',
                background: 'rgba(255, 255, 255, 0.90)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#1A162B',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                lineHeight: '1.4'
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }} aria-hidden="true">📹</span>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', color: '#4F46E5', fontWeight: 600 }}>Webcam Try-On &amp; 3D Controls</strong>
                <span style={{ color: '#4B5563' }}>Allow webcam for live AR face tracking, or click &amp; drag on canvas to rotate 3D glasses manually.</span>
              </div>
              <button
                type="button"
                onClick={() => setGuidanceDismissed(true)}
                aria-label="Dismiss guidance"
                title="Dismiss guidance"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  fontSize: '14px',
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>
          )}
          <MediaSelector />
        </div>
      )}
    </VictorShellThemeProvider>
  );
}

export default App;
