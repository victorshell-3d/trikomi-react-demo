import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { configStore } from '../store/ConfigStore';
import { StructureTab } from './tabs/StructureTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { RenderTab } from './tabs/RenderTab';

export const Sidebar = observer(() => {
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'structure' | 'appearance' | 'render'>('structure');

  // Dispatch window resize event at the end of the sidebar transition to recalculate canvas widths smoothly
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 320);
    return () => clearTimeout(timer);
  }, [isControlsOpen]);

  // Automatically switch tabs based on active selection
  useEffect(() => {
    if (configStore.selectedNodeId) {
      setActiveTab('structure');
    }
  }, [configStore.selectedNodeId]);

  useEffect(() => {
    if (configStore.selectedDesignElementId) {
      setActiveTab('appearance');
    }
  }, [configStore.selectedDesignElementId]);

  return (
    <>
      {/* Toggle Button when panel is closed */}
      <button
        className="panel-toggle-btn"
        onClick={() => setIsControlsOpen(true)}
        style={{ display: isControlsOpen ? 'none' : 'flex' }}
        title="Open Controls"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Docked Controls Panel */}
      <div className={`editor-panel ${!isControlsOpen ? 'collapsed' : ''}`}>
        <div className="editor-panel-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={`${import.meta.env.BASE_URL}logos/box.png`} style={{ height: '24px', width: 'auto', objectFit: 'contain' }} alt="Box Logo" />
          <h1 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>Box Configurator</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => configStore.setLandingPageOpen(true)}
              title="Return to Landing Page"
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'var(--color-border)',
                padding: '4px 8px',
                fontSize: '11px',
                borderRadius: '6px'
              }}
            >
              Templates
            </button>
            <button
              onClick={() => setIsControlsOpen(false)}
              style={{
                background: 'none', border: 'none', color: 'var(--color-text-muted)',
                cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab-trigger ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Structure
          </button>
          <button
            className={`sidebar-tab-trigger ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.32831 18.2396 6.13626 17.75 7.05076 17.75H16.9492C17.8637 17.75 18.6717 18.2396 19.1414 19C20.9097 17.1962 22 14.7255 22 12" />
              <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
              <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
              <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
            </svg>
            Appearance
          </button>
          <button
            className={`sidebar-tab-trigger ${activeTab === 'render' ? 'active' : ''}`}
            onClick={() => setActiveTab('render')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            Render
          </button>
        </div>

        <div className="sidebar-content">
          {activeTab === 'structure' && <StructureTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'render' && <RenderTab />}
        </div>
      </div>
    </>
  );
});
