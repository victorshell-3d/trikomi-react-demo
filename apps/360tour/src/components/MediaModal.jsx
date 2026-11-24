import React, { useState, useEffect } from 'react';
import { useLocalImage } from '../hooks/useLocalImage';
import { FrostedModalDialog } from '@trikomi/ui-kit';
import './MediaModal.css';

const LocalImagePreview = ({ tourId, url, alt, className }) => {
  const localUrl = useLocalImage(tourId, url);
  return localUrl ? <img src={localUrl} alt={alt} className={className} /> : <div className="loading-img">Loading...</div>;
};

const MediaModal = ({ isOpen, onClose, content, sourceBounds, tourId }) => {
  if (!isOpen || !content) return null;

  const renderContent = () => {
    if (content.type === 'image' && content.url) {
      return (
        <div className="media-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <LocalImagePreview 
            tourId={tourId}
            url={content.url} 
            alt={content.title || 'Shape image'} 
            className="media-image"
          />
          {content.description && (
            <p className="media-description" style={{ color: 'var(--vs-ink-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {content.description}
            </p>
          )}
        </div>
      );
    }
    
    if (content.type === 'url' && content.url) {
      return (
        <div className="media-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p className="media-description" style={{ color: 'var(--vs-ink-muted)' }}>Click below to navigate to the external link:</p>
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="media-link vs-btn vs-btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}
            onClick={onClose}
          >
            Open {content.url} ↗
          </a>
          {content.description && (
            <p className="media-description" style={{ color: 'var(--vs-ink-muted)', fontSize: '0.85rem' }}>{content.description}</p>
          )}
        </div>
      );
    }
    
    if (content.type === 'info' && content.content) {
      return (
        <div className="media-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p className="media-description" style={{ color: 'var(--vs-ink)', fontSize: '0.95rem', lineHeight: '1.6' }}>{content.content}</p>
        </div>
      );
    }

    return <p style={{ color: 'var(--vs-ink-muted)' }}>No content available</p>;
  };

  return (
    <FrostedModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={content.title || 'Interactive Media'}
      subtitle={content.type ? `Media Type: ${content.type.toUpperCase()}` : 'Tour Hotspot'}
      size="lg"
      className="vs-media-modal-dialog"
    >
      {renderContent()}
    </FrostedModalDialog>
  );
};

export default MediaModal;
