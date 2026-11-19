import './App.css';
import '@trikomi/ui-kit/styles.css';
import MediaSelector from './MediaSelector';
import { FaceMocapLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import { useEffect, useState } from 'react';

function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    // Always hide spinner initially
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'none';

    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isDemo = currentRoute.includes('demo');

  return (
    <VictorShellThemeProvider initialAccent="violet">
      {!isDemo ? (
        <FaceMocapLandingPage
          onExploreDemo={() => {
            window.location.hash = '#demo';
          }}
          exploreDemoHref="#demo"
          theme="violet"
        />
      ) : (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: 'var(--bg-color, #0a0a0f)' }}>
          <MediaSelector />
        </div>
      )}
    </VictorShellThemeProvider>
  );
}

export default App;
