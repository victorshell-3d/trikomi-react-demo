import { useState } from 'react';
import { ViewerStore, ViewerStoreContext } from '@trikomi/core';
import { Playground } from './Playground';
export default function OriginalPlayground() {
  const [store] = useState(() => new ViewerStore());
  return <ViewerStoreContext.Provider value={store}><Playground /></ViewerStoreContext.Provider>;
}
