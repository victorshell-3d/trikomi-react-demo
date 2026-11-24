import { useState, useEffect } from 'react';
import './App.css';
import MediaSelector from './MediaSelector';
import { FaceMocapLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => window.location.hash || '#/');

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
        <FaceMocapLandingPage
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
          <MediaSelector />
        </div>
      )}
    </VictorShellThemeProvider>
  );
}

export default App;
