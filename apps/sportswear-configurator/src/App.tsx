import React from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { MobileConfigDock } from './components/MobileConfigDock';
import { CameraViewGrid } from './components/CameraViewGrid';
import { OrderFormModal } from './components/OrderFormModal';
import './index.css';

function App() {
  return (
    <div className="luxury-studio-stage">
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
  );
}

export default App;
