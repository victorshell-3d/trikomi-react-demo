import { useState, useEffect } from 'react';
import { useLocalImage } from '../hooks/useLocalImage';
import './MediaModal.css';

const LocalImagePreview = ({ tourId, url, alt, className }) => {
  const localUrl = useLocalImage(tourId, url);
  return localUrl ? <img src={localUrl} alt={alt} className={className} /> : <div className="loading-img">Loading...</div>;
};

const MediaModal = ({ isOpen, onClose, content, sourceBounds, tourId }) => {
  const [animationState, setAnimationState] = useState({
    left: '50%',
    top: '50%',
    width: 'max-content',
    height: 'max-content',
    transform: 'translate(-50%, -50%)',
    transformOrigin: 'center center',
    padding: '24px',
    opacity: 0,
    overlayBg: 'rgba(0, 0, 0, 0)'
  });
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen && sourceBounds) {
      setIsRendered(true);
      
      // Start exactly at the shape's bounds with 3D homography transform
      setAnimationState({
        left: `${sourceBounds.left}px`,
        top: `${sourceBounds.top}px`,
        width: `${sourceBounds.width}px`,
        height: `${sourceBounds.height}px`,
        transform: sourceBounds.transform || 'none',
        transformOrigin: '0 0',
        padding: '0px',
        opacity: 0.5,
        overlayBg: 'rgba(0, 0, 0, 0)'
      });

      // Animate to center of screen with natural size
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationState({
            left: '50%',
            top: '50%',
            width: '80vw', // Final size can be max-content or specified
            height: 'max-content',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            padding: '24px',
            opacity: 1,
            overlayBg: 'rgba(0, 0, 0, 0.85)'
          });
        });
      });
    } else if (!isOpen && isRendered && sourceBounds) {
      // Animate back to exactly the shape's bounds
      setAnimationState({
        left: `${sourceBounds.left}px`,
        top: `${sourceBounds.top}px`,
        width: `${sourceBounds.width}px`,
        height: `${sourceBounds.height}px`,
        transform: sourceBounds.transform || 'none',
        transformOrigin: '0 0',
        padding: '0px',
        opacity: 0,
        overlayBg: 'rgba(0, 0, 0, 0)'
      });

      // Unmount after animation completes
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setIsRendered(false);
    }
  }, [isOpen, sourceBounds]);

  if (!isRendered || !content) return null;

  const renderContent = () => {
    if (content.type === 'image' && content.url) {
      return (
        <div className="media-content">
          <LocalImagePreview 
            tourId={tourId}
            url={content.url} 
            alt={content.title || 'Shape image'} 
            className="media-image"
          />
          {content.description && (
            <p className="media-description">{content.description}</p>
          )}
        </div>
      );
    }
    
    if (content.type === 'url' && content.url) {
      return (
        <div className="media-content">
          {content.title && <h3 className="media-title">{content.title}</h3>}
          <p className="media-description">Click below to open the link:</p>
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="media-link"
            onClick={onClose}
          >
            {content.url}
          </a>
          {content.description && (
            <p className="media-description">{content.description}</p>
          )}
        </div>
      );
    }
    
    if (content.type === 'info' && content.content) {
      return (
        <div className="media-content">
          {content.title && <h3 className="media-title">{content.title}</h3>}
          <p className="media-description">{content.content}</p>
        </div>
      );
    }

    return <p>No content available</p>;
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{ backgroundColor: animationState.overlayBg }}
    >
      <div 
        className="modal-container"
        style={{
          '--left': animationState.left,
          '--top': animationState.top,
          '--width': animationState.width,
          '--height': animationState.height,
          '--transform': animationState.transform,
          '--transformOrigin': animationState.transformOrigin,
          '--padding': animationState.padding,
          '--opacity': animationState.opacity,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        {renderContent()}
      </div>
    </div>
  );
};

export default MediaModal;
