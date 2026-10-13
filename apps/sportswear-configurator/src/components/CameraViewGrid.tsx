import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useConfigStore } from '../store/ConfiguratorStore';

type CameraAngle = 'front' | 'back' | 'left' | 'right';

export const CameraViewGrid: React.FC = observer(() => {
  const configStore = useConfigStore();
  const [activeAngle, setActiveAngle] = useState<CameraAngle>('front');

  const handleAngleSelect = (angle: CameraAngle) => {
    setActiveAngle(angle);
    configStore.triggerViewChange(angle);
  };

  return (
    <aside className="camera-view-grid-box" aria-label="Camera Views">
      <button
        className={`cam-grid-btn ${activeAngle === 'front' ? 'active' : ''}`}
        onClick={() => handleAngleSelect('front')}
        title="Front View"
      >
        <span className="cam-grid-label">F</span>
      </button>

      <button
        className={`cam-grid-btn ${activeAngle === 'back' ? 'active' : ''}`}
        onClick={() => handleAngleSelect('back')}
        title="Back View"
      >
        <span className="cam-grid-label">B</span>
      </button>

      <button
        className={`cam-grid-btn ${activeAngle === 'left' ? 'active' : ''}`}
        onClick={() => handleAngleSelect('left')}
        title="Left View"
      >
        <span className="cam-grid-label">L</span>
      </button>

      <button
        className={`cam-grid-btn ${activeAngle === 'right' ? 'active' : ''}`}
        onClick={() => handleAngleSelect('right')}
        title="Right View"
      >
        <span className="cam-grid-label">R</span>
      </button>
    </aside>
  );
});
