import { Routes, Route, Navigate } from 'react-router-dom';
import { TourLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';
import VirtualTour from './components/VirtualTour';
import PanoramaEditor2D from './components/PanoramaEditor2D';
import Dashboard from './components/Dashboard';
import TourEditor from './components/TourEditor';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import { useState, useEffect } from 'react';
import virtualTourStore from './store/VirtualTourStore';

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
      <VictorShellThemeProvider initialAccent="indigo">
        <div style={{ width: '100%', height: '100%' }}>
          <VirtualTour customConfigMode={true} />
        </div>
      </VictorShellThemeProvider>
    );
  }

  return (
    <VictorShellThemeProvider initialAccent="indigo">
      <AuthProvider>
        <div style={{ width: '100%', minHeight: '100vh' }}>
          <Routes>
            <Route
              path="/"
              element={
                <TourLandingPage
                  onExploreDemo={() => {
                    window.location.hash = '#/dashboard';
                  }}
                  exploreDemoHref="#/dashboard"
                  theme="indigo"
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
                  {/* Floating Back to Overview Bar */}
                  <div
                    style={{
                      position: 'fixed',
                      top: '16px',
                      left: '16px',
                      zIndex: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        window.location.hash = '#/';
                      }}
                      className="vs-back-to-landing-btn"
                      style={{
                        background: 'rgba(23, 20, 39, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '999px',
                        color: '#ffffff',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ← Back to Overview
                    </button>
                  </div>
                  <Dashboard />
                </div>
              }
            />
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
