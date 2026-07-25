import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useViewerStore, ThreeViewer } from '@trikomi/core';
import * as THREE from 'three/webgpu';

declare global {
  interface Window {
    __THREE_VIEWER_INSTANCE__?: ThreeViewer;
  }
}

interface LabelProps {
  text: string;
  worldPos: [number, number, number];
  color: string;
}

const MeasurementLabel: React.FC<LabelProps> = ({ text, worldPos, color }) => {
  const viewerStore = useViewerStore();
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    let animationFrameId: number;
    
    const updatePosition = () => {
      const viewer = viewerStore.viewer as ThreeViewer;
      if (viewer && viewer.camera) {
        const vector = new THREE.Vector3(worldPos[0], worldPos[1], worldPos[2]);
        // Project to screen space
        vector.project(viewer.camera);
        
        // Convert to CSS coordinates
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
        
        // Only show if it's somewhat in front of the camera
        if (vector.z < 1) {
          setPos({ x, y });
        } else {
          setPos({ x: -1000, y: -1000 });
        }
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    return () => cancelAnimationFrame(animationFrameId);
  }, [worldPos]);

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: color,
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        border: `1px solid ${color}`,
        zIndex: 100
      }}
    >
      {text}
    </div>
  );
};

export const MeasurementOverlay: React.FC = observer(() => {
  const viewerStore = useViewerStore();
  if (!viewerStore.showMeasurements || !viewerStore.measurementData || !viewerStore.selectedMesh) {
    return null;
  }

  const data = viewerStore.measurementData;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
      <MeasurementLabel text={`X: ${parseFloat(data.x).toFixed(2)}`} worldPos={[parseFloat(data.midX[0]), parseFloat(data.midX[1]), parseFloat(data.midX[2])]} color="#ff6b6b" />
      <MeasurementLabel text={`Y: ${parseFloat(data.y).toFixed(2)}`} worldPos={[parseFloat(data.midY[0]), parseFloat(data.midY[1]), parseFloat(data.midY[2])]} color="#51cf66" />
      <MeasurementLabel text={`Z: ${parseFloat(data.z).toFixed(2)}`} worldPos={[parseFloat(data.midZ[0]), parseFloat(data.midZ[1]), parseFloat(data.midZ[2])]} color="#339af0" />
    </div>
  );
});
