import { useState, useEffect } from 'react';
import { uploadApi } from '../api/dashboardApi';
import { useLocalImage } from '../hooks/useLocalImage';
import './ImageSelectDialog.css';

// A wrapper component to render local images/videos securely
const LocalImagePreview = ({ tourId, url, alt }) => {
  const localUrl = useLocalImage(tourId, url);
  if (!localUrl) return <div className="loading-img">Loading...</div>;
  
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return <video src={localUrl} muted loop autoPlay playsInline style={{ maxWidth: '100%', maxHeight: '100px' }} />;
  }
  if (url.endsWith('.mp3') || url.endsWith('.wav')) {
    return <audio src={localUrl} controls style={{ maxWidth: '100%' }} />;
  }
  return <img src={localUrl} alt={alt} />;
};

const ImageSelectDialog = ({ isOpen, onClose, tourId, onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && tourId) {
      loadImages();
    }
  }, [isOpen, tourId]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await uploadApi.getShapeImages(tourId);
      setImages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await uploadApi.uploadInfoImage(tourId, file);
      await loadImages();
      e.target.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="image-dialog-overlay" onClick={onClose}>
      <div className="image-dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="image-dialog-header">
          <h3>Select or Upload Media</h3>
          <button className="image-dialog-close" onClick={onClose}>×</button>
        </div>

        <div className="image-dialog-content">
          <label className="upload-btn">
            {uploading ? 'Uploading...' : 'Upload New Media'}
            <input
              type="file"
              accept="image/*,video/mp4,audio/mp3,audio/wav"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <p>No images uploaded yet</p>
              <p className="hint">Upload an image to get started</p>
            </div>
          ) : (
            <div className="image-grid">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="image-card"
                  onClick={() => onImageSelect(image)}
                >
                  <div className="image-preview">
                    <LocalImagePreview tourId={tourId} url={image.url} alt={image.original_name} />
                  </div>
                  <div className="image-info">
                    <p className="image-name">{image.original_name}</p>
                    {image.dimensions && (
                      <span className="image-dimensions">
                        {image.dimensions.width} × {image.dimensions.height}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSelectDialog;
