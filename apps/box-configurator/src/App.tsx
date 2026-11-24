import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { BoxLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';
import { ShapeEditorModal } from './components/ShapeEditorModal';
import { Playground } from './components/Playground';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { configStore } from './store/ConfigStore';
import './index.css';

/** Options passed in by the widget host (e.g. a CMS embed or iframe parent). */
export interface WidgetOptions {
  /** URL to a remote JSON config file to load on mount. */
  config?: string;
}

export const App = observer(({ widgetOptions }: { widgetOptions?: WidgetOptions }) => {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);

    // Check for data-config provided by widget
    if (widgetOptions?.config) {
      configStore.fetchRemoteConfig(widgetOptions.config);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [widgetOptions]);

  const isDemo = currentRoute.includes('demo') || currentRoute.includes('playground');

  return (
    <VictorShellThemeProvider initialAccent="indigo">
      {!isDemo ? (
        <BoxLandingPage
          onExploreDemo={() => {
            configStore.setLandingPageOpen(false);
            window.location.hash = '#demo';
          }}
          exploreDemoHref="#demo"
          theme="indigo"
        />
      ) : (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
          {currentRoute === '#/playground' ? (
            <Playground onBack={() => { window.location.hash = '#/'; }} />
          ) : configStore.landingPageOpen ? (
            <LandingPage />
          ) : (
            <div className="app-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
              {/* Floating Back to Overview Button */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 9999 }}>
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
              <Sidebar />
              <MainContent />
              {configStore.editingTemplateId && <ShapeEditorModal />}
            </div>
          )}
        </div>
      )}
    </VictorShellThemeProvider>
  );
});

export default App;
