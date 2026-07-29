import React, { useState } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Sidebar } from './components/Sidebar';
import { OrderFormModal } from './components/OrderFormModal';
import './index.css'; // We'll just rely on global css for reset

function App() {
  const [sidebarActive, setSidebarActive] = useState(false);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: '#f8fafc'
    }}>
      {/* 3D Canvas Area */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <ThreeCanvas />
      </div>
      
      {/* Header Overlay */}
      <div style={{
        position: 'absolute', top: '32px', left: '32px',
        background: 'rgba(255, 255, 255, 0.65)', padding: '16px 32px',
        borderRadius: '20px', backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <img src={`${import.meta.env.BASE_URL}logos/jersey.png`} style={{ height: '40px', width: 'auto', objectFit: 'contain' }} alt="Sportswear Configurator" />
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            Trikomi
          </h1>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Sportswear Configurator</div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="mobile-toggle-btn"
        onClick={() => setSidebarActive(!sidebarActive)}
        aria-label="Toggle Sidebar"
      >
        {sidebarActive ? (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Configuration Sidebar */}
      <div className={`sidebar-wrapper ${sidebarActive ? 'active' : ''}`}>
        <Sidebar />
      </div>

      {/* Order Form Modal Overlay */}
      <OrderFormModal />
    </div>
  );
}

export default App;
