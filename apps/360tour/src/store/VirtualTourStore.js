import { makeAutoObservable } from 'mobx';
import tourApi from '../api/tourApi';

class VirtualTourStore {
  loading = true;
  tourData = null;
  currentSceneId = null;
  debugInfo = '';

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(value) {
    this.loading = value;
  }

  setTourData(data) {
    if (data) {
      if (!data.settings) {
        data.settings = {
          auto_rotate: false,
          auto_rotate_speed: 1.0,
          global_audio_url: null,
          nadir_patch_url: null,
          nadir_patch_scale: 1.0,
          welcome_screen: { enabled: false, html: '' }
        };
      }
    }
    this.tourData = data;
    if (data && data.scenes && data.scenes.length > 0) {
      this.currentSceneId = data.scenes[0].id;
    }
  }

  updateSettings(newSettings) {
    if (this.tourData) {
      this.tourData.settings = { ...this.tourData.settings, ...newSettings };
    }
  }

  setCurrentScene(sceneId) {
    this.currentSceneId = sceneId;
  }

  setDebugInfo(info) {
    this.debugInfo = info;
  }

  get currentScene() {
    if (!this.tourData || !this.currentSceneId) return null;
    return this.tourData.scenes.find(s => s.id === this.currentSceneId);
  }

  get scenes() {
    return this.tourData?.scenes || [];
  }

  // Load tour from API
  async loadTourFromApi(tourId = 1) {
    this.setLoading(true);
    try {
      if (tourId === 'standalone') {
        await this.loadTour('./tour.json');
        return;
      }
      const data = await tourApi.getTour(tourId);
      this.setTourData(data);
      this.setDebugInfo('Tour loaded from API successfully');
    } catch (error) {
      console.error('Failed to load tour from API:', error);
      this.setDebugInfo('Failed to load tour from API');
      // Fallback to static JSON
      await this.loadTour();
    } finally {
      this.setLoading(false);
    }
  }

  // Load tour from JSON file (fallback)
  async loadTour(url = '/tour.json') {
    this.setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.setTourData(data);
      this.setDebugInfo('Tour loaded from JSON file');
    } catch (error) {
      console.error('Failed to load tour:', error);
      this.setDebugInfo('Failed to load tour');
    } finally {
      this.setLoading(false);
    }
  }
}

const virtualTourStore = new VirtualTourStore();
export default virtualTourStore;
