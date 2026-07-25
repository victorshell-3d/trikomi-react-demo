import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { tourApi, sceneApi, uploadApi, shapeApi } from '../api/dashboardApi';
import SceneSidebar from './editor/SceneSidebar';
import EditorSidebar from './editor/EditorSidebar';
import ImageViewer from './editor/ImageViewer';
import AddSceneModal from './editor/AddSceneModal';
import ScenePropertiesModal from './editor/ScenePropertiesModal';
import AddHotspotModal from './editor/AddHotspotModal';
import ImageSelectDialog from './ImageSelectDialog';
import ExportDialog from './ExportDialog';
import FloorPlanModal from './FloorPlanModal';
import TourSettingsModal from './editor/TourSettingsModal';
import { hotspotApi, audioPointApi } from '../api/dashboardApi';

const TourEditor = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [activeScene, setActiveScene] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddScene, setShowAddScene] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightSidebarTab, setRightSidebarTab] = useState('hotspots');
  const [hotspotCreationMode, setHotspotCreationMode] = useState(false);
  const [pendingHotspotCoords, setPendingHotspotCoords] = useState(null);
  const [showAddHotspot, setShowAddHotspot] = useState(false);
  const [shapeCreationMode, setShapeCreationMode] = useState(null); // 'image' or 'video'
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [audioPointCreationMode, setAudioPointCreationMode] = useState(false);
  const [selectedAudioPoint, setSelectedAudioPoint] = useState(null);
  const [initialViewCreationMode, setInitialViewCreationMode] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState(null); // 'audio', 'shape', 'panorama'
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showTourSettings, setShowTourSettings] = useState(false);
  const [tourSettings, setTourSettings] = useState(null);

  useEffect(() => {
    loadTour();
  }, [tourId]);

  const loadTour = async () => {
    try {
      setLoading(true);
      const tourData = await tourApi.getTour(tourId);
      setTour(tourData);
      setTourSettings(tourData.settings || {});

      // Load hotspots and audio points for each scene
      const scenesWithData = await Promise.all(
        (tourData.scenes || []).map(async (scene) => {
          try {
            const hotspots = await hotspotApi.getHotspots(tourId, scene.id);
            const audio_points = await audioPointApi.getAudioPoints(tourId, scene.id);
            return { ...scene, hotspots, audio_points };
          } catch {
            return { ...scene, hotspots: [], audio_points: [] };
          }
        })
      );

      setScenes(scenesWithData);
      if (scenesWithData.length > 0 && !activeScene) {
        setActiveScene(scenesWithData[0]);
      }
    } catch (_err) {
      setError('Failed to load tour');
    } finally {
      setLoading(false);
    }
  };

  const handleSceneSelect = async (scene) => {
    setActiveScene(scene);
    // Reload hotspots for this scene to ensure fresh data
    if (scene.id && (!scene.hotspots || scene.hotspots.length === 0)) {
      try {
        const hotspots = await hotspotApi.getHotspots(tourId, scene.id);
        const updated = { ...scene, hotspots };
        setActiveScene(updated);
        setScenes(scenes.map(s => s.id === scene.id ? updated : s));
      } catch {
        // Silent fail - scene might not have hotspots yet
      }
    }
  };

  const handleAddScene = async (sceneName) => {
    try {
      const newScene = await sceneApi.createScene(tourId, { name: sceneName, panorama: '' });
      setScenes([...scenes, newScene]);
      setActiveScene(newScene);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create scene');
    }
  };

  const handleDeleteScene = async (sceneId) => {
    if (!confirm('Delete this scene?')) return;
    try {
      await sceneApi.deleteScene(tourId, sceneId);
      const updated = scenes.filter(s => s.id !== sceneId);
      setScenes(updated);
      if (activeScene?.id === sceneId) setActiveScene(updated[0] || null);
    } catch (_err) {
      setError('Failed to delete scene');
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      const updatedTour = await tourApi.updateSettings(tourId, newSettings);
      setTour(updatedTour);
      setTourSettings(updatedTour.settings || {});
    } catch (_err) {
      setError('Failed to update tour settings');
    }
  };

  const handleUploadPanorama = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeScene) return;
    try {
      setUploading(true);
      const result = await uploadApi.uploadPanorama(tourId, file, activeScene.id);
      const updated = { ...activeScene, panorama: result.url, thumbnail: result.thumbnail_url };
      setActiveScene(updated);
      setScenes(scenes.map(s => s.id === activeScene.id ? updated : s));
    } catch (err) {
      console.error("Upload error:", err);
      setError('Failed to upload panorama: ' + (err.message || 'unknown error'));
    } finally {
      setUploading(false);
      setFileInputKey(prev => prev + 1); // Reset file input
    }
  };

  // Hotspot creation handlers
  const startHotspotCreation = () => {
    setHotspotCreationMode(true);
    setRightSidebarTab('hotspots');
    if (!rightSidebarOpen) setRightSidebarOpen(true);
  };

  const handleImageClickForHotspot = (yaw, pitch) => {
    setPendingHotspotCoords({ yaw, pitch });
    setShowAddHotspot(true);
    setHotspotCreationMode(false);
  };

  const handleImageClickForInitialView = async (yaw, pitch) => {
    if (!activeScene) return;
    try {
      const updated = await sceneApi.updateScene(tourId, activeScene.id, {
        initial_view: { yaw, pitch }
      });
      setActiveScene(updated);
      setScenes(scenes.map(s => s.id === activeScene.id ? updated : s));
    } catch (_err) {
      setError('Failed to set initial view');
    }
    setInitialViewCreationMode(false);
  };

  const handleCreateHotspot = async (hotspotData) => {
    if (!activeScene) return;
    try {
      const newHotspot = await hotspotApi.createHotspot(tourId, activeScene.id, hotspotData);
      
      // Auto-assign linked scene thumbnail for immediate preview
      if (newHotspot.type === 'scene' || newHotspot.target_scene_id) {
        const targetId = newHotspot.target_scene_id || (newHotspot.targetScene && newHotspot.targetScene.id);
        const targetScene = scenes.find(s => s.id === targetId);
        if (targetScene && !newHotspot.thumbnail) {
          newHotspot.thumbnail = targetScene.thumbnail || targetScene.thumbnail_url;
        }
      }

      const updated = {
        ...activeScene,
        hotspots: [...(activeScene.hotspots || []), newHotspot]
      };
      setActiveScene(updated);
      setScenes(scenes.map(s => s.id === activeScene.id ? updated : s));
    } catch (_err) {
      setError('Failed to create hotspot');
    }
    setPendingHotspotCoords(null);
  };

  const handleDeleteHotspot = async (hotspotId) => {
    try {
      await hotspotApi.deleteHotspot(tourId, activeScene.id, hotspotId);
      const updated = activeScene.hotspots.filter(h => h.id !== hotspotId);
      setActiveScene({ ...activeScene, hotspots: updated });
      setScenes(scenes.map(s => s.id === activeScene.id ? { ...s, hotspots: updated } : s));
    } catch (_err) {
      setError('Failed to delete hotspot');
    }
  };

  const handleUpdateHotspot = async (hotspotId, data) => {
    try {
      const updatedHotspot = await hotspotApi.updateHotspot(tourId, activeScene.id, hotspotId, data);
      const updatedHotspots = activeScene.hotspots.map(h => h.id === hotspotId ? updatedHotspot : h);
      setActiveScene({ ...activeScene, hotspots: updatedHotspots });
      setScenes(scenes.map(s => s.id === activeScene.id ? { ...s, hotspots: updatedHotspots } : s));
      return updatedHotspot;
    } catch (err) {
      setError('Failed to update hotspot');
      throw err;
    }
  };

  const handleStartShapeCreation = () => {
    setShapeCreationMode(true);
    setCurrentShape({ points: [] });
  };

  const handleCancelShapeCreation = () => {
    setShapeCreationMode(false);
    setCurrentShape(null);
  };

  // Audio Point handlers
  const startAudioPointCreation = () => {
    setAudioPointCreationMode(true);
    setRightSidebarTab('audio');
    if (!rightSidebarOpen) setRightSidebarOpen(true);
  };

  const handleImageClickForAudio = async (yaw, pitch) => {
    if (!activeScene || !audioPointCreationMode) return;
    
    try {
      const newAudioPoint = {
        title: `Audio ${((activeScene.audio_points || []).length + 1)}`,
        yaw,
        pitch,
        audio_url: ''
      };
      
      const created = await audioPointApi.createAudioPoint(tourId, activeScene.id, newAudioPoint);
      const updated = {
        ...activeScene,
        audio_points: [...(activeScene.audio_points || []), created]
      };
      setActiveScene(updated);
      setScenes(scenes.map(s => s.id === activeScene.id ? updated : s));
      setSelectedAudioPoint(created);
    } catch (_err) {
      setError('Failed to create audio point');
    }
    setAudioPointCreationMode(false);
  };

  const handleDeleteAudioPoint = async (pointId) => {
    try {
      await audioPointApi.deleteAudioPoint(tourId, activeScene.id, pointId);
      const updated = (activeScene.audio_points || []).filter(p => p.id !== pointId);
      setActiveScene({ ...activeScene, audio_points: updated });
      setScenes(scenes.map(s => s.id === activeScene.id ? { ...s, audio_points: updated } : s));
      if (selectedAudioPoint?.id === pointId) setSelectedAudioPoint(null);
    } catch (_err) {
      setError('Failed to delete audio point');
    }
  };

  const handleUpdateAudioPoint = async (pointId, data) => {
    try {
      const updated = await audioPointApi.updateAudioPoint(tourId, activeScene.id, pointId, data);
      const updatedPoints = activeScene.audio_points.map(p => p.id === pointId ? updated : p);
      setActiveScene({ ...activeScene, audio_points: updatedPoints });
      setScenes(scenes.map(s => s.id === activeScene.id ? { ...s, audio_points: updatedPoints } : s));
      return updated;
    } catch (err) {
      setError('Failed to update audio point');
      throw err;
    }
  };

  const handlePreview = () => {
    navigate(`/tour/${tourId}`);
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleDeleteShape = async (shapeId) => {
    try {
      await shapeApi.deleteShape(tourId, activeScene.id, shapeId);
      const updated = (activeScene.shapes || []).filter(s => s.id !== shapeId);
      setActiveScene({ ...activeScene, shapes: updated });
      setScenes(scenes.map(s => s.id === activeScene.id ? { ...s, shapes: updated } : s));
      if (selectedShape?.id === shapeId) setSelectedShape(null);
    } catch (_err) {
      setError('Failed to delete shape');
    }
  };

  const handleUpdateShape = async (shapeId, updates) => {
    try {
      // Handle media attachment separately
      if (updates.media && updates.media.id) {
        // First, detach any existing media
        const currentShape = (activeScene.shapes || []).find(s => s.id === shapeId);
        if (currentShape && currentShape.media_files && currentShape.media_files.length > 0) {
          for (const media of currentShape.media_files) {
            await shapeApi.detachMedia(tourId, activeScene.id, shapeId, media.id);
          }
        }
        
        // Attach new media
        await shapeApi.attachMedia(
          tourId, 
          activeScene.id, 
          shapeId, 
          updates.media.id,
          {
            title: updates.media.title || updates.media.original_name,
            description: updates.media.description
          }
        );
        
        // Remove media from updates before calling updateShape
        const { _media, ...otherUpdates } = updates;
        if (Object.keys(otherUpdates).length > 0) {
          await shapeApi.updateShape(tourId, activeScene.id, shapeId, otherUpdates);
        }
      } else {
        await shapeApi.updateShape(tourId, activeScene.id, shapeId, updates);
      }
      
      const updatedShapes = (activeScene.shapes || []).map(s => 
        s.id === shapeId ? { ...s, ...updates } : s
      );
      const updatedScene = { ...activeScene, shapes: updatedShapes };
      setActiveScene(updatedScene);
      setScenes(scenes.map(s => s.id === activeScene.id ? updatedScene : s));
      if (selectedShape?.id === shapeId) {
        setSelectedShape({ ...selectedShape, ...updates });
      }
    } catch (err) {
      console.error('Failed to update shape:', err);
      setError('Failed to update shape');
    }
  };

  const handleImageSelect = async (image) => {
    if (galleryTarget === 'audio' && selectedAudioPoint) {
      // Attach audio file to the selected audio point
      const audioUrl = image.url || image.file_path || `images/${image.id}`;
      await handleUpdateAudioPoint(selectedAudioPoint.id, { audio_url: audioUrl });
      setSelectedAudioPoint(prev => prev ? { ...prev, audio_url: audioUrl } : prev);
    } else if (galleryTarget === 'shape' && selectedShape) {
      await handleUpdateShape(selectedShape.id, {
        media: image,
        action_type: 'show_image'
      });
      // Update local state to reflect the new media immediately
      setSelectedShape(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          media: image,
          media_files: [{
            id: image.id,
            file_path: image.url || image.file_path,
            url: image.url,
            original_name: image.original_name
          }]
        };
      });
    } else if (galleryTarget === 'panorama' && activeScene) {
      const updated = { ...activeScene, panorama: image.url, thumbnail: image.thumbnail_url || image.url };
      setActiveScene(updated);
      setScenes(scenes.map(s => s.id === activeScene.id ? updated : s));
      await sceneApi.updateScene(tourId, activeScene.id, { panorama: image.url, thumbnail: image.thumbnail_url || image.url });
    }
    setShowImageDialog(false);
  };

  const handleShapePointClick = async (x, y) => {
    if (!shapeCreationMode || !currentShape) return;
    
    // Add point to current shape
    const updatedShape = {
      ...currentShape,
      points: [...currentShape.points, { x, y }]
    };
    setCurrentShape(updatedShape);
    
    // Check if shape is complete (e.g., 3+ points and close to first point)
    if (updatedShape.points.length >= 3) {
      const firstPoint = updatedShape.points[0];
      const distance = Math.sqrt(Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2));
      if (distance < 20) { // Within 20 pixels of first point
        // Complete the shape
        const newShape = {
          id: Date.now().toString(),
          name: `Shape ${((activeScene.shapes || []).length + 1)}`,
          type: 'polygon',
          points: updatedShape.points,
          style: {
            strokeColor: '#ff0000',
            fillColor: 'rgba(255, 255, 255, 0.3)',
            lineWidth: 3
          }
        };
        
        // Save to API
        try {
          await shapeApi.createShape(tourId, activeScene.id, newShape);
        } catch (err) {
          console.error('Failed to save shape to API:', err);
          // Still add to local state even if API fails
        }
        
        const updated = { ...activeScene, shapes: [...(activeScene.shapes || []), newShape] };
        setActiveScene(updated);
        setScenes(scenes.map(s => s.id === activeScene.id ? updated : s));
        
        // Reset shape creation
        setShapeCreationMode(false);
        setCurrentShape(null);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading…</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="editor-layout">
        {leftSidebarOpen && (
          <SceneSidebar
            tourId={tourId}
            scenes={scenes}
            activeScene={activeScene}
            onSceneSelect={handleSceneSelect}
            onAddScene={() => setShowAddScene(true)}
            onDeleteScene={handleDeleteScene}
            onManageFloorPlan={() => setShowFloorPlanModal(true)}
          />
        )}

        <ImageViewer
          tourId={tourId}
          activeScene={activeScene}
          uploading={uploading}
          onUpload={handleUploadPanorama}
          error={error}
          leftSidebarOpen={leftSidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
          onBack={() => navigate('/dashboard')}
          onShowProperties={() => setShowProperties(true)}
          onPreview={handlePreview}
          onExport={handleExport}
          hotspotCreationMode={hotspotCreationMode}
          shapeCreationMode={shapeCreationMode}
          audioPointCreationMode={audioPointCreationMode}
          initialViewCreationMode={initialViewCreationMode}
          currentShape={currentShape}
          onImageClick={(yaw, pitch) => {
            if (hotspotCreationMode) handleImageClickForHotspot(yaw, pitch);
            if (audioPointCreationMode) handleImageClickForAudio(yaw, pitch);
            if (initialViewCreationMode) handleImageClickForInitialView(yaw, pitch);
          }}
          onShapeClick={handleShapePointClick}
          onCancelHotspotCreation={() => setHotspotCreationMode(false)}
          onCancelShapeCreation={handleCancelShapeCreation}
          onCancelAudioPointCreation={() => setAudioPointCreationMode(false)}
          onCancelInitialViewCreation={() => setInitialViewCreationMode(false)}
          fileInputKey={fileInputKey}
          onOpenImageDialog={() => {
            setGalleryTarget('panorama');
            setShowImageDialog(true);
          }}
        />

        {rightSidebarOpen && (
          <EditorSidebar
            activeScene={activeScene}
            scenes={scenes}
            activeTab={rightSidebarTab}
            onTabChange={setRightSidebarTab}
            onStartHotspotCreation={startHotspotCreation}
            onDeleteHotspot={handleDeleteHotspot}
            onUpdateHotspot={handleUpdateHotspot}
            hotspotCreationMode={hotspotCreationMode}
            onStartShapeCreation={handleStartShapeCreation}
            onDeleteShape={handleDeleteShape}
            shapeCreationMode={shapeCreationMode}
            onStartAudioPointCreation={startAudioPointCreation}
            onDeleteAudioPoint={handleDeleteAudioPoint}
            onUpdateAudioPoint={handleUpdateAudioPoint}
            audioPointCreationMode={audioPointCreationMode}
            tourId={tourId}
            tourSettings={tourSettings}
            onUpdateSettings={handleUpdateSettings}
            onOpenSettings={() => setShowTourSettings(true)}
            onUpdateScene={async (updates) => {
              const updated = await sceneApi.updateScene(tourId, activeScene.id, updates);
              setActiveScene(updated);
              setScenes(scenes.map(s => s.id === activeScene.id ? updated : s));
            }}
            selectedShape={selectedShape}
            onSelectShape={setSelectedShape}
            onUpdateShape={handleUpdateShape}
            selectedAudioPoint={selectedAudioPoint}
            onSelectAudioPoint={setSelectedAudioPoint}
            onOpenImageDialog={() => {
              if (selectedAudioPoint) setGalleryTarget('audio');
              else if (selectedShape) setGalleryTarget('shape');
              setShowImageDialog(true);
            }}
          />
        )}
      </div>

      <AddSceneModal
        isOpen={showAddScene}
        onClose={() => setShowAddScene(false)}
        onAdd={handleAddScene}
      />

      <ScenePropertiesModal
        isOpen={showProperties}
        onClose={() => setShowProperties(false)}
        activeScene={activeScene}
        tourId={tourId}
        setActiveScene={setActiveScene}
        uploading={uploading}
        onOpenPanoramaDialog={() => {
          setGalleryTarget('panorama');
          setShowImageDialog(true);
        }}
        onSetInitialView={() => {
          setShowProperties(false);
          setInitialViewCreationMode(true);
        }}
      />

      <AddHotspotModal
        isOpen={showAddHotspot}
        onClose={() => {
          setShowAddHotspot(false);
          setPendingHotspotCoords(null);
        }}
        onAdd={handleCreateHotspot}
        scenes={scenes}
        currentSceneId={activeScene?.id}
        yaw={pendingHotspotCoords?.yaw || 0}
        pitch={pendingHotspotCoords?.pitch || 0}
        tourId={tourId}
      />

      <ImageSelectDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        tourId={tourId}
        onImageSelect={handleImageSelect}
      />

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        tourId={tourId}
        tourTitle={tour?.title || '360 Tour'}
      />

      <FloorPlanModal
        isOpen={showFloorPlanModal}
        onClose={() => setShowFloorPlanModal(false)}
        tourId={tourId}
        tourSettings={tourSettings || {}}
        onUpdateSettings={handleUpdateSettings}
        scenes={scenes}
        onUpdateScene={async (sceneId, updates) => {
          const updated = await sceneApi.updateScene(tourId, sceneId, updates);
          setScenes(scenes.map(s => s.id === sceneId ? updated : s));
          if (activeScene?.id === sceneId) setActiveScene(updated);
        }}
      />

      <TourSettingsModal
        isOpen={showTourSettings}
        tourId={tourId}
        tourData={tour}
        onClose={() => setShowTourSettings(false)}
        onUpdateSettings={handleUpdateSettings}
      />
    </DashboardLayout>
  );
};

export default TourEditor;
