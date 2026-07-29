import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Playground } from './components/Playground';

function DummyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '60px 40px', color: '#ffffff', background: '#0f172a', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐 Dummy Login / Auth Route (/login)</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '500px', textAlign: 'center' }}>
        URL Path: <code>/login</code>.<br />
        This is a real React Router navigation route. Clicking back unmounts the current route and remounts <code>/</code> (3D Viewer).
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}
      >
        ← Back to 3D Jewelry Configurator (/)
      </button>
    </div>
  );
}

function NavigationBar() {
  return (
    <nav style={{
      position: 'absolute',
      top: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      padding: '6px 12px',
      borderRadius: '30px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
    }}>
      <Link
        to="/"
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          textDecoration: 'none',
          background: window.location.pathname === '/' ? '#6366f1' : 'transparent',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}
      >
        💎 3D Configurator (/)
      </Link>
      <Link
        to="/login"
        style={{
          padding: '8px 16px',
          borderRadius: '20px',
          textDecoration: 'none',
          background: window.location.pathname === '/login' ? '#6366f1' : 'transparent',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}
      >
        🔐 Login Route (/login)
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Playground />} />
          <Route path="/login" element={<DummyPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
