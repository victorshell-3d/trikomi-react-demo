import { useState, useEffect } from 'react';
import { Playground } from './components/Playground';
import { JewelryLandingPage, VictorShellThemeProvider } from '@trikomi/ui-kit';
import '@trikomi/ui-kit/styles.css';

export default function App() {
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
    <VictorShellThemeProvider initialAccent="orchid">
      {!isDemo ? (
        <JewelryLandingPage
          onExploreDemo={() => {
            window.location.hash = '#demo';
          }}
          exploreDemoHref="#demo"
          theme="orchid"
        />
      ) : (
        <Playground />
      )}
    </VictorShellThemeProvider>
  );
}
