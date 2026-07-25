import React, { useState } from 'react';
import * as THREE from 'three/webgpu';
import { observer } from 'mobx-react-lite';
import { useViewerStore } from '@trikomi/core';

interface SceneGraphNodeProps {
  node: THREE.Object3D;
  depth?: number;
}

export const SceneGraphNode: React.FC<SceneGraphNodeProps> = observer(({ node, depth = 0 }) => {
  const viewerStore = useViewerStore();
  const [expanded, setExpanded] = useState(true);

  // Filter out internal helpers (like Gizmos)
  if (node.name.includes('TransformControls') || node.name.includes('Helper')) {
    return null;
  }

  // Read sceneGraphVersion to force re-render when hierarchy changes externally
  const __version = viewerStore.sceneGraphVersion;

  const isSelected = viewerStore.selectedMesh === node;
  
  // Handle InstancedMesh as a special case for children
  const isInstanced = (node as THREE.InstancedMesh).isInstancedMesh;
  const instanceCount = isInstanced ? (node as THREE.InstancedMesh).count : 0;
  
  const hasChildren = (node.children && node.children.length > 0) || (isInstanced && instanceCount > 0);
  
  // Decide icon based on type
  let icon = '📦';
  if ((node as THREE.Mesh).isMesh) icon = isInstanced ? '💠' : '🧊';
  if ((node as THREE.Light).isLight) icon = '💡';
  if ((node as THREE.Camera).isCamera) icon = '🎥';
  if (node.type === 'Group') icon = '📁';
  if (node.type === 'Bone') icon = '🦴';

  return (
    <div style={{ paddingLeft: `${depth === 0 ? 0 : 12}px`, fontSize: '13px' }}>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 6px',
          background: isSelected ? 'rgba(79, 143, 255, 0.2)' : 'transparent',
          borderLeft: isSelected ? '2px solid #4f8fff' : '2px solid transparent',
          cursor: 'pointer',
          borderRadius: '0 4px 4px 0',
          opacity: node.visible ? 1 : 0.4
        }}
        onClick={(e) => {
          e.stopPropagation();
          if ((node as THREE.Mesh).isMesh) {
            // Enable editing mode if it isn't already, since they specifically selected a mesh from the tree
            if (!viewerStore.editingMode) {
              viewerStore.setEditingMode(true);
            }
            viewerStore.setSelectedMesh(node as THREE.Object3D);
          }
        }}
      >
        <span 
          style={{ width: '16px', display: 'inline-block', textAlign: 'center', cursor: 'pointer', opacity: hasChildren ? 0.8 : 0 }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (expanded ? '▼' : '▶') : ''}
        </span>
        <span style={{ marginRight: '6px' }}>{icon}</span>
        <span style={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          flex: 1
        }}>
          {node.name || node.type}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            node.visible = !node.visible;
            // Force re-render of this specific piece of state in MobX might require a hack, 
            // but since React state isn't strictly tied to node.visible, we can just force update.
            setExpanded(prev => prev); // dummy trigger
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            padding: '0 4px'
          }}
        >
          {node.visible ? '👁' : '🙈'}
        </button>
      </div>

      {expanded && hasChildren && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {isInstanced ? (
            // Render virtual children for instances
            Array.from({ length: instanceCount }).map((_, idx) => (
              <div key={`instance-${idx}`} style={{ paddingLeft: `${depth === 0 ? 0 : 12}px`, fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', opacity: node.visible ? 0.8 : 0.4 }}>
                  <span style={{ width: '16px', display: 'inline-block' }}></span>
                  <span style={{ marginRight: '6px' }}>🔹</span>
                  <span style={{ flex: 1 }}>Instance {idx}</span>
                </div>
              </div>
            ))
          ) : (
            // Render actual Object3D children
            node.children.map((child, idx) => (
              <SceneGraphNode key={child.uuid || idx} node={child} depth={depth + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
});
