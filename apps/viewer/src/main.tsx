/// <reference types="vite/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ViewerStore, ViewerStoreContext } from '@trikomi/core';

// Standalone dev entry: create one ViewerStore for the whole dev session
const devStore = new ViewerStore();

createRoot(document.getElementById('root')!).render(
  <ViewerStoreContext.Provider value={devStore}>
    <App />
  </ViewerStoreContext.Provider>
);
