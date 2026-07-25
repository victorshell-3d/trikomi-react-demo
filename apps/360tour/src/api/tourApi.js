import { tourApi as baseTourApi, shapeApi, sceneApi } from './dashboardApi';

const tourApi = {
  getTours: baseTourApi.getTours,
  getTour: baseTourApi.getTour,
  createTour: baseTourApi.createTour,
  updateTour: baseTourApi.updateTour,
  deleteTour: baseTourApi.deleteTour,
  
  addShapeToScene: async (tourId, sceneId, shapeData) => {
    return shapeApi.createShape(tourId, sceneId, shapeData);
  },

  deleteShapeFromScene: async (tourId, sceneId, shapeId) => {
    return shapeApi.deleteShape(tourId, sceneId, shapeId);
  },

  updateScene: async (tourId, sceneId, sceneData) => {
    return sceneApi.updateScene(tourId, sceneId, sceneData);
  },
};

export default tourApi;
