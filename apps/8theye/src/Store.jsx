/* eslint-disable */
import { observable } from "mobx";


const store = observable({
    camera: undefined,
    cameras: [],
    runningMode: 'VIDEO',
    canvasElement: undefined,
    grid: false,
    tracking: false,
    mirror: true,
    loaded: false,
    naturalLighting: true,
    isArActive: true,
    modelIndex: 0,
    // Dynamic Configurator State
    glassConfigs: {
        meshes: [],
        materials: []
    },
    meshVisibility: {},
    materialProps: {},
    lipstick: false,
    lipstickColor: '#ff0055',
    lipstickOpacity: 0.6,
    
    fetchCameras() {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(_res => {
                navigator.mediaDevices.enumerateDevices()
                    .then((devices) => {
                        const newCameras = [];
                        devices.forEach((device) => {
                            if (device.kind === "videoinput") {
                                newCameras.push(device);
                            }
                        });
                        this.cameras = newCameras;
                    })
                    .catch((err) => {
                        console.error("Error retrieving devices: ", err);
                    });
            }).catch(err => {
                console.warn("Camera access denied or unavailable", err);
            });
        } else {
            console.warn("navigator.mediaDevices is undefined. Secure context (HTTPS) is required for camera access.");
        }
    }
});

export default store;



