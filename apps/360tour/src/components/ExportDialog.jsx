import React, { useState, useEffect } from 'react';
import { exportApi } from '../api/exportApi';

const ExportDialog = ({ isOpen, onClose, tourId, tourTitle }) => {
  const [_token, setToken] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setToken('');
      setIsExporting(false);
      setProgress(0);
      setStatusText('');
      setError('');
    }
  }, [isOpen]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError('');
      
      const conf = window.trikomi_config || {};
      const actualToken = conf.fallbackJwt || conf.apiKey || '';
      
      await exportApi.exportTourAsZip(tourId, actualToken, (status, percent) => {
        setStatusText(status);
        setProgress(percent);
      });

      setTimeout(() => { onClose(); }, 1500);
    } catch (err) {
      setError('Export failed: ' + (err.message || 'Unknown error'));
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-md">
        <div className="modal-head">
          <span className="modal-head-title">Export Tour</span>
          {!isExporting && <button className="modal-close-btn" onClick={onClose}>×</button>}
        </div>
        
        <div className="modal-body">
          <div style={{ marginBottom: 16 }}>
            <label className="label">Tour Name</label>
            <div className="input-field" style={{ opacity: 0.7 }}>
              {tourTitle || `Tour #${tourId}`}
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            The standalone viewer will be exported with the auto-auth testing token automatically injected.
          </p>

          {error && <div className="error-bar">{error}</div>}

          {isExporting && (
            <div style={{ marginBottom: 16 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{statusText}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-accent) 0%, #a5b4fc 100%)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'width 0.3s ease-out'
                }} />
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-foot">
          <button onClick={onClose} disabled={isExporting} className="btn btn-secondary">Cancel</button>
          <button onClick={handleExport} disabled={isExporting} className="btn btn-primary">
            {isExporting ? 'Exporting…' : 'Export Tour'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
