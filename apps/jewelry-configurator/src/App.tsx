import { lazy, Suspense } from 'react';
import { Studio } from './components/Studio';
const OriginalPlayground = lazy(() => import('./components/OriginalPlayground'));

export default function App() {
  // Keep the original SDK playground available on its separate route.
  if (new URLSearchParams(window.location.search).get('view') === 'original') {
    return <Suspense fallback={<div>Loading original playground...</div>}><OriginalPlayground /></Suspense>;
  }
  return <Studio />;
}
