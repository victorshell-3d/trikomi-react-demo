import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { ConfiguratorStore, ConfigStoreContext } from './store/ConfiguratorStore';
import { ViewerStore, ViewerStoreContext } from '@trikomi/core';

const configStore = new ConfiguratorStore();
const viewerStore = new ViewerStore();

createRoot(document.getElementById('root')!).render(
  <ViewerStoreContext.Provider value={viewerStore}>
    <ConfigStoreContext.Provider value={configStore}>
      <App />
    </ConfigStoreContext.Provider>
  </ViewerStoreContext.Provider>
);
