import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
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
  }, []);

  if (currentRoute === '#/playground') {
    return <Playground onBack={() => { window.location.hash = '#/'; }} />;
  }

  if (configStore.landingPageOpen) {
    return <LandingPage />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <MainContent />
      {configStore.editingTemplateId && <ShapeEditorModal />}
    </div>
  );
});
