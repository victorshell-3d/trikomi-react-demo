/* eslint-disable */
import _React, { useEffect, useRef } from 'react';
import { autorun } from 'mobx';
import * as THREE from 'three';
import store, { boosters, unityBlendShapes, unRealblendshapes } from "./Store";
import { ThreeViewer, viewerStore, GLTFPlugin } from '@trikomi/core';
import { FaceMocapPlugin } from '@trikomi/core/face-mocap';
import glassesUrl from '/models/glasses.glb';
import raccoonUrl from '/models/raccoon_head_small.glb';
import headOccluderUrl from '/models/head_occluder.obj';

export const mocapPlugin = new FaceMocapPlugin(import.meta.env.DEV ? '/assets/wasm' : '../assets/wasm');

const ThreeD = () => {
    const mountRef = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // 1. Initialize ThreeViewer from @trikomi/core
        const viewer = new ThreeViewer(mountRef.current, viewerStore, {
            onAuthorized: () => {
                // 3. Setup Core FaceMocapPlugin
                viewer.addPlugin(mocapPlugin);
            }
        });
        viewerRef.current = viewer;

        // 2. Ensure GLTFPlugin is attached (if not already added by default config)
        if (!viewer.getPlugin(GLTFPlugin)) {
            viewer.addPlugin(new GLTFPlugin());
        }


        viewer.camera.position.set(0, 0, 0);
        viewer.camera.rotation.set(0, 0, 0);
        viewer.camera.lookAt(0, 0, -1);

        // MediaPipe facial transformation assumes an ~63 degree vertical FOV
        viewer.camera.fov = 63;
        viewer.camera.updateProjectionMatrix();


        // Sync local app state to the core plugin
        const videoAutorun = autorun(() => {
            if (store.camera) {
                mocapPlugin.setVideoSource(store.camera);
            }
            if (store.canvasElement && store.canvasElement !== mocapPlugin.debugCanvas) {
                mocapPlugin.setDebugCanvas(store.canvasElement);
            }
            mocapPlugin.debugGrid = store.grid;

            mocapPlugin.activeModelId = store.avatar;
            mocapPlugin.smoothStep = store.smoothStep;
            mocapPlugin.isRecording = store.recording;
            mocapPlugin.mirror = store.mirror;

            // Sync LiveLink to plugin
            mocapPlugin.enableLiveLink = store.connected;
            mocapPlugin.liveLinkUrl = 'ws://' + store.serverAddress;

            // Sync boosters from store to plugin
            for (const key in boosters) {
                // Ensure key mapping matches Tracker.jsx capitalized keys
                const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
                mocapPlugin.boosters[camelKey] = boosters[key];
            }
        });

        // Sync tracking state from plugin back to store for UI
        const syncInterval = setInterval(() => {
            if (store.tracking !== mocapPlugin.isTracking) {
                store.tracking = mocapPlugin.isTracking;
            }

            if (store.loaded !== mocapPlugin.isLoaded) {
                store.loaded = mocapPlugin.isLoaded;
            }

            if (mocapPlugin.isTracking) {
                // Format blendshapes for UI display only!
                for (const [key, value] of Object.entries(mocapPlugin.blendShapes)) {
                    const unrealKey = key.charAt(0).toUpperCase() + key.slice(1);
                    const finalVal = value.toFixed(6);
                    unRealblendshapes[unrealKey] = finalVal;
                    unityBlendShapes[key] = finalVal;
                }
                Object.assign(store.blendshapes, unRealblendshapes);
            }
        }, 16);

        // Ensure transparent background so video underneath is visible
        viewerStore.setBackgroundColor('transparent');

        // 4. Load Avatars using the Core GLTFPlugin
        const gltfPlugin = viewer.getPlugin(GLTFPlugin);
        if (gltfPlugin) {

            // Load Glasses with Occluder
            gltfPlugin.gltfLoader.load(glassesUrl, (gltf) => {
                const glassesScene = gltf.scene;
                // Scale glasses natively here
                glassesScene.scale.set(100, 100, 100);

                const group = new THREE.Group();
                group.add(glassesScene);

                // Load face occluder via the plugin
                mocapPlugin.loadOccluder(headOccluderUrl);

                viewer.scene.add(group);
                mocapPlugin.registerModel({
                    id: 'glasses',
                    model: group,
                    scale: 1,
                    hasMorphTargets: false
                });
            });

            // Load Raccoon
            gltfPlugin.gltfLoader.load(raccoonUrl, (gltf) => {
                const model = gltf.scene;
                viewer.scene.add(model);

                if (model) {
                    mocapPlugin.registerModel({
                        id: 'raccoon',
                        model: model,
                        scale: 36,
                        hasMorphTargets: true
                    });
                }
            });
        }

        // 5. Sync Viewer with dynamic container resizing
        const resizeObserver = new ResizeObserver(() => {
            if (viewerRef.current && viewerRef.current.handleResize) {
                viewerRef.current.handleResize();
            }
        });
        resizeObserver.observe(mountRef.current);

        // Cleanup
        return () => {
            if (videoAutorun) videoAutorun();
            clearInterval(syncInterval);
            resizeObserver.disconnect();
            if (viewerRef.current) {
                viewerRef.current.dispose();
            }
        };
    }, []);

    // Pointer events none so it doesn't block UI
    return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }} />;
};

export default ThreeD;