import {
  getTourHandle,
  readTourData,
  writeTourData,
  listAllTours,
  createNewTourDirectory,
  deleteTourDirectory,
  saveImageFile,
  openExistingTourDirectory,
  listImageFiles,
  deleteImageFile,
  duplicateTourDirectory,
  generateUUID,
  updateTourData,
  cleanOrphanedMedia
} from '@trikomi/core/tour';

// Tour API
export const tourApi = {
  getTours: async () => listAllTours(),
  getDashboard: async () => listAllTours(),
  getTour: async (id) => readTourData(await getTourHandle(id)),
  createTour: async (data) => createNewTourDirectory(data.title),
  updateTour: async (id, data) => updateTourData(id, t => ({ ...t, ...data })),
  deleteTour: async (id) => deleteTourDirectory(id),
  duplicateTour: async (id) => {
    const tour = await readTourData(await getTourHandle(id));
    const newTitle = tour ? `${tour.title} (Copy)` : 'Copy of Tour';
    return await duplicateTourDirectory(id, newTitle);
  },
  exportTour: async (_id) => { throw new Error('Export not supported in local mode'); },
  updateSettings: async (id, settings) => updateTourData(id, t => ({ ...t, settings })),
  // Special helper to open existing from user OS
  openExisting: async () => openExistingTourDirectory(),
};

// Scene API
export const sceneApi = {
  getScenes: async (tourId) => (await tourApi.getTour(tourId)).scenes || [],
  createScene: async (tourId, data) => {
    let newScene = null;
    await updateTourData(tourId, t => {
      newScene = { id: generateUUID(), hotspots: [], shapes: [], ...data };
      t.scenes = t.scenes || [];
      t.scenes.push(newScene);
      return t;
    });
    return newScene;
  },
  updateScene: async (tourId, sceneId, data) => {
    let updatedScene = null;
    await updateTourData(tourId, t => {
      t.scenes = t.scenes.map(s => {
        if (s.id === sceneId) {
          updatedScene = { ...s, ...data };
          return updatedScene;
        }
        return s;
      });
      return t;
    });
    return updatedScene;
  },
  deleteScene: async (tourId, sceneId) => {
    await updateTourData(tourId, t => {
      t.scenes = t.scenes.filter(s => s.id !== sceneId);
      return t;
    });
    // Fire and forget media cleanup
    uploadApi.cleanOrphanedMedia(tourId).catch(console.error);
  },
  reorderScenes: async (tourId, scenes) => {
    await updateTourData(tourId, t => {
      t.scenes = scenes;
      return t;
    });
    return { success: true };
  },
  setDefaultScene: async (tourId, sceneId) => {
    await updateTourData(tourId, t => {
      t.settings = t.settings || {};
      t.settings.default_scene_id = sceneId;
      return t;
    });
    return { success: true };
  },
};

// Hotspot API
export const hotspotApi = {
  getHotspots: async (tourId, sceneId) => {
    const tour = await tourApi.getTour(tourId);
    const scene = tour.scenes.find(s => s.id === sceneId);
    return scene ? (scene.hotspots || []) : [];
  },
  createHotspot: async (tourId, sceneId, data) => {
    let newHotspot = null;
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene) {
        scene.hotspots = scene.hotspots || [];
        newHotspot = { id: generateUUID(), ...data };
        scene.hotspots.push(newHotspot);
      }
      return t;
    });
    return newHotspot;
  },
  updateHotspot: async (tourId, sceneId, hotspotId, data) => {
    let updatedHotspot = null;
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene && scene.hotspots) {
        scene.hotspots = scene.hotspots.map(h => {
          if (h.id === hotspotId) {
            updatedHotspot = { ...h, ...data };
            return updatedHotspot;
          }
          return h;
        });
      }
      return t;
    });
    return updatedHotspot;
  },
  deleteHotspot: async (tourId, sceneId, hotspotId) => {
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene && scene.hotspots) {
        scene.hotspots = scene.hotspots.filter(h => h.id !== hotspotId);
      }
      return t;
    });
    uploadApi.cleanOrphanedMedia(tourId).catch(console.error);
  },
  reorderHotspots: async (tourId, sceneId, hotspots) => {
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene) scene.hotspots = hotspots;
      return t;
    });
    return { success: true };
  },
};

// Shape API
export const shapeApi = {
  getShapes: async (tourId, sceneId) => {
    const tour = await tourApi.getTour(tourId);
    const scene = tour.scenes.find(s => s.id === sceneId);
    return scene ? (scene.shapes || []) : [];
  },
  createShape: async (tourId, sceneId, data) => {
    let newShape = null;
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene) {
        scene.shapes = scene.shapes || [];
        newShape = { id: generateUUID(), media: [], ...data };
        scene.shapes.push(newShape);
      }
      return t;
    });
    return newShape;
  },
  updateShape: async (tourId, sceneId, shapeId, data) => {
    let updatedShape = null;
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene && scene.shapes) {
        scene.shapes = scene.shapes.map(s => {
          if (s.id === shapeId) {
            updatedShape = { ...s, ...data };
            return updatedShape;
          }
          return s;
        });
      }
      return t;
    });
    return updatedShape;
  },
  deleteShape: async (tourId, sceneId, shapeId) => {
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene && scene.shapes) {
        scene.shapes = scene.shapes.filter(s => s.id !== shapeId);
      }
      return t;
    });
    uploadApi.cleanOrphanedMedia(tourId).catch(console.error);
  },
  attachMedia: async (tourId, sceneId, shapeId, mediaFileId, pivotData = {}) => {
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene) {
        const shape = scene.shapes.find(s => s.id === shapeId);
        if (shape) {
          shape.media_files = shape.media_files || [];
          // Remove existing media to ensure only 1 image attached if that's the intended behavior
          // Actually, keep it pushing as TourEditor detaches manually first
          shape.media_files.push({
            id: mediaFileId,
            file_path: `images/${mediaFileId}`,
            full_path: `images/${mediaFileId}`,
            pivot: pivotData
          });
        }
      }
      return t;
    });
    return { success: true };
  },
  detachMedia: async (tourId, sceneId, shapeId, mediaId) => {
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene) {
        const shape = scene.shapes.find(s => s.id === shapeId);
        if (shape && shape.media_files) {
          shape.media_files = shape.media_files.filter(m => m.id !== mediaId);
        }
      }
      return t;
    });
    return { success: true };
  },
  reorderShapes: async (tourId, sceneId, shapes) => {
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene) scene.shapes = shapes;
      return t;
    });
    return { success: true };
  },
};

// Audio Point API
export const audioPointApi = {
  getAudioPoints: async (tourId, sceneId) => {
    const tour = await tourApi.getTour(tourId);
    const scene = tour.scenes.find(s => s.id === sceneId);
    return scene ? (scene.audio_points || []) : [];
  },
  createAudioPoint: async (tourId, sceneId, data) => {
    let newPoint = null;
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene) {
        scene.audio_points = scene.audio_points || [];
        newPoint = { id: generateUUID(), ...data };
        scene.audio_points.push(newPoint);
      }
      return t;
    });
    return newPoint;
  },
  updateAudioPoint: async (tourId, sceneId, pointId, data) => {
    let updatedPoint = null;
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene && scene.audio_points) {
        scene.audio_points = scene.audio_points.map(p => {
          if (p.id === pointId) {
            updatedPoint = { ...p, ...data };
            return updatedPoint;
          }
          return p;
        });
      }
      return t;
    });
    return updatedPoint;
  },
  deleteAudioPoint: async (tourId, sceneId, pointId) => {
    await updateTourData(tourId, t => {
      const scene = t.scenes.find(s => s.id === sceneId);
      if (scene && scene.audio_points) {
        scene.audio_points = scene.audio_points.filter(p => p.id !== pointId);
      }
      return t;
    });
  },
};

// File Upload API
export const uploadApi = {
  uploadPanorama: async (tourId, file, sceneId = null) => {
    const path = await saveImageFile(tourId, file);
    if (sceneId) {
      await sceneApi.updateScene(tourId, sceneId, { panorama: path, thumbnail: path });
    }
    return { url: path, thumbnail_url: path, path }; // Use path for URL so components can resolve it using our hook
  },
  
  uploadAsset: async (tourId, file) => {
    const path = await saveImageFile(tourId, file);
    return path;
  },
  
  uploadShapeImage: async (tourId, file) => {
    const path = await saveImageFile(tourId, file);
    return { url: path };
  },
  
  uploadInfoImage: async (tourId, file) => {
    const path = await saveImageFile(tourId, file);
    return { url: path };
  },
  
  getShapeImages: async (tourId) => {
    return await listImageFiles(tourId);
  },

  listMedia: async (tourId, _type = null) => {
    return [];
  },
  
  deleteMedia: async (tourId, mediaId) => {
    // Determine fileName (strip 'images/' if present)
    const fileName = mediaId.startsWith('images/') ? mediaId.substring(7) : mediaId;
    await deleteImageFile(tourId, fileName);
    return { success: true };
  },
  
  cleanOrphanedMedia: async (tourId) => {
    return cleanOrphanedMedia(tourId);
  }
};

export default { tourApi, sceneApi, hotspotApi, shapeApi, audioPointApi, uploadApi };
