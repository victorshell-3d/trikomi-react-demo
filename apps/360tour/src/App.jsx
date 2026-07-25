import { Routes, Route, Navigate } from 'react-router-dom';
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
      <div style={{ width: '100%', height: '100%' }}>
         <VirtualTour customConfigMode={true} />
      </div>
    );
  }

  return (
    <AuthProvider>
      <div style={{ width: '100%', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/editor/:tourId" element={<TourEditor />} />
          <Route path="/tour/:tourId" element={<VirtualTour />} />
          <Route path="/editor2d" element={<PanoramaEditor2D />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
