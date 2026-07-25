/* eslint-disable */
import { useState, useEffect } from 'react';
import { getImageObjectURL } from '@trikomi/core/tour';

export function useLocalImage(tourId, relativePath) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!relativePath) {
      setObjectUrl(null);
      return;
    }

    // If it's already a blob, data URI, or http URL, just use it
    if (relativePath.startsWith('blob:') || relativePath.startsWith('data:') || relativePath.startsWith('http')) {
      setObjectUrl(relativePath);
      return;
    }

    let url = null;
    let isMounted = true;

    if (window.__STANDALONE__) {
      const parts = relativePath.split('/');
      const fileName = parts[parts.length - 1];
      url = `./images/${fileName}`;
      setObjectUrl(url);
    } else {
      getImageObjectURL(tourId, relativePath).then(resolvedUrl => {
        console.log("Resolved local image:", relativePath, "to", resolvedUrl);
        if (isMounted && resolvedUrl) {
          url = resolvedUrl;
          setObjectUrl(url);
        }
      }).catch(err => {
        console.warn("Failed to load local image", relativePath, err);
      });
    }

    return () => {
      isMounted = false;
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [tourId, relativePath]);

  return objectUrl;
}
