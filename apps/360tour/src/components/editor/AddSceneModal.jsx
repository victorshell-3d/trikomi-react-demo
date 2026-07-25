import { useState } from 'react';

const AddSceneModal = ({ isOpen, onClose, onAdd }) => {
  const [sceneName, setSceneName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sceneName.trim()) return;
    onAdd(sceneName);
    setSceneName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-sm">
        <div className="modal-head">
          <span className="modal-head-title">Add New Scene</span>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <label className="label">Scene Name</label>
            <input
              type="text"
              value={sceneName}
              onChange={(e) => setSceneName(e.target.value)}
              className="input-field"
              placeholder="e.g., Living Room"
              autoFocus
            />
            <div className="flex gap-2" style={{ marginTop: 16 }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSceneModal;
