/* eslint-disable */
import { observable } from "mobx";


const store = observable({
    camera: '',
    avatar: 'raccoon',
    cameras: [],
    runningMode: 'VIDEO',
    recording: false,
    canvasElement: undefined,
    grid: false,
    tracking: false,
    time: '',
    smoothStep: .5,
    mirror: true,
    serverAddress: "127.0.0.1:5000",
    connected: false,
    booster: false,
    blendshapes: {},
    loaded: false

});

export const boosters = {};

export const unityBlendShapes = {};
export const unRealblendshapes = {};

export default store;

if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(_res => {
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                devices.forEach(function (device) {
                    if (device.kind === "videoinput") {
                        store.cameras.push(device);
                    }
                });
            })
            .catch(function (err) {
                console.error("Error retrieving devices: ", err);
            });
    }).catch(err => {
        console.warn("Camera access denied or unavailable", err);
    });
} else {
    console.warn("navigator.mediaDevices is undefined. Secure context (HTTPS) is required for camera access.");
}

