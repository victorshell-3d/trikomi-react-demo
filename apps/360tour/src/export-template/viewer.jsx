/* eslint-disable */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import VirtualTour from '../components/VirtualTour';
import '../index.css';

import { ThreeViewer, ViewerStore } from '@trikomi/core';

// Signal to VirtualTour.jsx and its dependencies that we are running in standalone mode
window.__STANDALONE__ = true;

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<VirtualTour />} />
      </Routes>
    </HashRouter>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
const spinner = document.getElementById('spinner');
if (spinner) spinner.style.display = 'none';
root.render(<App />);
