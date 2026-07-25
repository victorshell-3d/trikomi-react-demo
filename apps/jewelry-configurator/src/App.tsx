import React from 'react';
import { Playground } from './components/Playground';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Playground />
    </div>
  );
}
