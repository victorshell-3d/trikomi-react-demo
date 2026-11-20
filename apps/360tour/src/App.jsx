import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import VirtualTour from './components/VirtualTour';
import PanoramaEditor2D from './components/PanoramaEditor2D';
import Dashboard from './components/Dashboard';
import TourEditor from './components/TourEditor';
import { AuthProvider } from './context/AuthContext';
import { TourLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';
import './App.css';

import { useState, useEffect } from 'react';
import virtualTourStore from './store/VirtualTourStore';

function TourLandingWrapper() {
  const navigate = useNavigate();
  return (
    <TourLandingPage
      onExploreDemo={() => navigate('/dashboard')}
      exploreDemoHref="#/dashboard"
      theme="violet"
    />
  );
}

function DashboardWrapper() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(() => (typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false));

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('[360Tour] Fullscreen request error:', err);
        });
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('[360Tour] Fullscreen exit error:', err);
        });
      }
    } catch (err) {
      console.warn('[360Tour] Fullscreen error:', err);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Top Floating Controls Bar */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          data-testid="tour-fullscreen-toggle"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            color: '#1A162B',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(110, 44, 242, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>

        {/* Back to landing page navigation pill */}
        <button
          type="button"
          onClick={() => navigate('/')}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(110, 44, 242, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(110, 44, 242, 0.15)';
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Overview</span>
        </button>
      </div>
      <Dashboard />
    </div>
  );
}

function App({ widgetOptions }) {
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    if (widgetOptions?.config) {
      console.log('[TourApp] Fetching config from:', widgetOptions.config);
      fetch(widgetOptions.config)
        .then(res => res.json())
        .then(data => {
          virtualTourStore.setTourData(data);
          setConfigLoaded(true);
        })
        .catch(err => {
          console.error('[TourApp] Failed to load config:', err);
          setConfigLoaded(true);
        });
    } else {
      setConfigLoaded(true);
    }
  }, [widgetOptions]);

  if (!configLoaded) return null;

  // If we have a custom config provided by a widget, we should ONLY render the virtual tour viewer (no dashboard)
  if (widgetOptions?.config) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
         <VirtualTour customConfigMode={true} />
      </div>
    );
  }

  return (
    <VictorShellThemeProvider initialAccent="violet">
      <AuthProvider>
        <div style={{ width: '100%', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<TourLandingWrapper />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/demo" element={<Navigate to="/dashboard" replace />} />
            <Route path="/editor/:tourId" element={<TourEditor />} />
            <Route path="/tour/:tourId" element={<VirtualTour />} />
            <Route path="/editor2d" element={<PanoramaEditor2D />} />
          </Routes>
        </div>
      </AuthProvider>
    </VictorShellThemeProvider>
  );
}

export default App;
