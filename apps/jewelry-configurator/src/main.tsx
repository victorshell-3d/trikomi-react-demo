import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { ViewerStore, ViewerStoreContext } from '@trikomi/core';

const store = new ViewerStore();

createRoot(document.getElementById('root')!).render(
  <ViewerStoreContext.Provider value={store}>
    <App />
  </ViewerStoreContext.Provider>
);
