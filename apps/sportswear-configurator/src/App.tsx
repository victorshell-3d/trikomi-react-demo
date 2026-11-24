import React, { useState, useEffect } from 'react';
import { SportswearLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';
import { ThreeCanvas } from './components/ThreeCanvas';
import { MobileConfigDock } from './components/MobileConfigDock';
import { CameraViewGrid } from './components/CameraViewGrid';
import { OrderFormModal } from './components/OrderFormModal';
import './index.css';

/**
 * Original Sportswear Configurator Stage (preserved from HEAD)
 */
function SportswearConfigurator() {
  return (
    <div className="luxury-studio-stage">
      {/* 1. High-Key Softbox Studio Backdrop */}
      <div className="studio-light-backdrop" />

      {/* 2. Soft Ambient Floor Glow */}
      <div className="studio-floor-ambience" />

      {/* Floating Back to Overview Button */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 9999
        }}
      >
        <button
          type="button"
          onClick={() => {
            window.location.hash = '#/';
          }}
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
          ← Overview
        </button>
      </div>

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
  );
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isDemo = currentRoute.includes('demo');

  return (
    <VictorShellThemeProvider initialAccent="indigo">
      {!isDemo ? (
        <SportswearLandingPage
          onExploreDemo={() => {
            window.location.hash = '#demo';
          }}
          exploreDemoHref="#demo"
          theme="indigo"
        />
      ) : (
        <SportswearConfigurator />
      )}
    </VictorShellThemeProvider>
  );
}

export default App;
