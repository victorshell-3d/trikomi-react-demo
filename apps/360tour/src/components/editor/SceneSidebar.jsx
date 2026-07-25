import { useLocalImage } from '../../hooks/useLocalImage';

const SceneThumbnail = ({ tourId, url }) => {
  const localUrl = useLocalImage(tourId, url);
  return localUrl
    ? <img src={localUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    : <span style={{ fontSize: '0.85rem' }}>🌐</span>;
};

const SceneSidebar = ({ tourId, scenes, activeScene, onSceneSelect, onAddScene, onDeleteScene, onManageFloorPlan }) => {
  return (
    <div className="editor-left-sidebar">
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <span className="section-label">Scenes</span>
        <button onClick={() => onAddScene()} className="btn btn-primary btn-xs">+ Add</button>
      </div>

      <button
        onClick={() => onManageFloorPlan && onManageFloorPlan()}
        className="btn btn-secondary btn-sm w-full"
        style={{ marginBottom: 8, justifyContent: 'center' }}
      >
        🗺️ Manage Map
      </button>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            onClick={() => onSceneSelect(scene)}
            className={`list-item${activeScene?.id === scene.id ? ' active' : ''}`}
          >
            <div className="list-thumb">
              {scene.thumbnail ? (
                <SceneThumbnail tourId={tourId} url={scene.thumbnail} />
              ) : (
                <span style={{ fontSize: '0.85rem' }}>🌐</span>
              )}
            </div>
            <div className="list-text">
              <div className="list-name">{scene.name}</div>
              <div className="list-sub">#{index + 1}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteScene(scene.id); }}
              className="list-delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SceneSidebar;
