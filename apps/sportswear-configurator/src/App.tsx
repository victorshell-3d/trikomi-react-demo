import React, { useState, useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { MobileConfigDock } from './components/MobileConfigDock';
import { CameraViewGrid } from './components/CameraViewGrid';
import { OrderFormModal } from './components/OrderFormModal';
import { SportswearLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';
import './index.css';

function App() {
  const [route, setRoute] = useState(() => (typeof window !== 'undefined' ? window.location.hash || '#/' : '#/'));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isDemo = route.includes('demo') || route.includes('studio') || route.includes('configurator');

  return (
    <VictorShellThemeProvider initialAccent="violet" initialThemeMode="dark">
      {!isDemo ? (
        <SportswearLandingPage
          onExploreDemo={() => {
            window.location.hash = '#demo';
          }}
          exploreDemoHref="#demo"
          theme="orange"
        />
      ) : (
        <div className="luxury-studio-stage">
          {/* Back to Landing Page navigation pill */}
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 9999 }}>
            <button
              type="button"
              data-testid="sportswear-overview-back-btn"
              onClick={() => {
                window.location.hash = '#/';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '9999px',
                background: 'rgba(14, 16, 23, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 114, 0, 0.45)',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 12px rgba(255, 114, 0, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 114, 0, 0.8)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 114, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 114, 0, 0.45)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 12px rgba(255, 114, 0, 0.2)';
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Overview</span>
            </button>
          </div>

          {/* 1. High-Key Softbox Studio Backdrop */}
          <div className="studio-light-backdrop" />

          {/* 2. Soft Ambient Floor Glow */}
          <div className="studio-floor-ambience" />

          {/* Immersive 3D Canvas */}
          <div className="canvas-wrapper">
            <ThreeCanvas />
          </div>

          {/* Sleek Minimal Luxury Brand Header */}
          <header className="luxury-brand-header">
            <span className="brand-mark">TRIKOMI</span>
            <span className="brand-divider">/</span>
            <span className="brand-sub">CUSTOM LAB</span>
          </header>

          {/* Top-Right 4-Grid Camera View Box */}
          <CameraViewGrid />

          {/* Mobile-First Floating Dock & Tooltip Popups */}
          <MobileConfigDock />

          {/* Order Form Modal Overlay */}
          <OrderFormModal />
        </div>
      )}
    </VictorShellThemeProvider>
  );
}

export default App;
