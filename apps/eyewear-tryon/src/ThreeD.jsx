/* eslint-disable */
import _React, { useEffect, useRef } from 'react';
import { autorun } from 'mobx';
import * as THREE from 'three/webgpu';
import store from "./Store";
import { ThreeViewer, viewerStore, GLTFPlugin, StatsPlugin } from '@trikomi/core';
import { FaceMocapPlugin } from '@trikomi/core/face-mocap';
import { EyewearConfigurator } from '@trikomi/core/eyewear';
const glassesUrl = '/models/glasses1.glb';
const glasses2Url = '/models/glasses2.glb';
const glasses3Url = '/models/glasses3.glb';
const glasses4Url = '/models/glasses4.glb';
const glasses5Url = '/models/glasses5.glb';
const glasses6Url = '/models/glasses6.glb';
const headOccluderUrl = '/models/head_occluder.obj';
const envMapUrl = '/images/brown_photostudio_02.webp';

export const AVAILABLE_MODELS = [
    { name: 'Aviator Classic', url: glassesUrl, thumb: '/thumbs/glasses1.png', scale: 0.3 },
    { name: 'Sport Wrap', url: glasses2Url, thumb: '/thumbs/glasses2.png', scale: 0.3 },
    { name: 'Wayfarer Style', url: glasses3Url, thumb: '/thumbs/glasses3.png', scale: 0.3 },
    { name: 'Round Metal', url: glasses4Url, thumb: '/thumbs/glasses4.png', scale: 0.3 },
    { name: 'Clubmaster', url: glasses5Url, thumb: '/thumbs/glasses5.png', scale: 0.3 },
    { name: 'Hexagonal', url: glasses6Url, thumb: '/thumbs/glasses6.png', scale: 0.3 }
];

export const mocapPlugin = new FaceMocapPlugin('/assets/wasm');
mocapPlugin.smoothStep = 0.5; // Ensure smoothStep is defined for lerping

const ThreeD = () => {
    const mountRef = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        let syncInterval;
        let videoAutorun;
        let modelIndexAutorun;
        let configAutorun;

        try {
            if (!mountRef.current) return;

            // 1. Initialize ThreeViewer from @trikomi/core
            const viewer = new ThreeViewer(mountRef.current, viewerStore, {
                onAuthorized: () => {
                    // 3. Setup Core FaceMocapPlugin
                    viewer.addPlugin(mocapPlugin);
                }
            });
            viewerRef.current = viewer;

            // 2. Ensure GLTFPlugin is attached
            if (!viewer.getPlugin(GLTFPlugin)) {
                viewer.addPlugin(new GLTFPlugin());
            }
            if (!viewer.getPlugin(StatsPlugin)) {
                viewer.addPlugin(new StatsPlugin());
                viewerStore.setShowStats(true);
            }

            // Preload Synthetic Map for the core plugin to use
            const texLoader = new THREE.TextureLoader();
            texLoader.load(envMapUrl, (tex) => {
                tex.mapping = THREE.EquirectangularReflectionMapping;
                mocapPlugin.setSyntheticEnvMap(tex);
            });

            viewer.camera.position.set(0, 0, 0);
            viewer.camera.rotation.set(0, 0, 0);
            viewer.camera.lookAt(0, 0, -1);

            // MediaPipe facial transformation assumes an ~63 degree vertical FOV
            viewer.camera.fov = 63;
            viewer.camera.updateProjectionMatrix();

            // Sync local app state to the core plugin
            videoAutorun = autorun(() => {
                if (store.camera) {
                    mocapPlugin.setVideoSource(store.camera);
                }
                if (store.canvasElement && store.canvasElement !== mocapPlugin.debugCanvas) {
                    mocapPlugin.setDebugCanvas(store.canvasElement);
                }
                mocapPlugin.debugGrid = store.grid;
                mocapPlugin.enableNaturalLighting = store.naturalLighting;
                mocapPlugin.lipstickVisible = store.lipstick;
                if (store.lipstickColor) mocapPlugin.lipstickColor = store.lipstickColor;
                if (store.lipstickOpacity !== undefined) mocapPlugin.lipstickOpacity = store.lipstickOpacity;
                mocapPlugin.activeModelId = 'glasses';

                // Fix mirrored stats
                const statsPlugin = viewer.getPlugin(StatsPlugin);
                if (statsPlugin && statsPlugin.stats && statsPlugin.stats.dom) {
                    statsPlugin.stats.dom.style.transform = store.mirror ? 'scaleX(-1)' : 'none';
                    // Need to reset left/right since the container itself is flipped visually
                    if (store.mirror) {
                        statsPlugin.stats.dom.style.left = 'auto';
                        statsPlugin.stats.dom.style.right = '24px';
                    } else {
                        statsPlugin.stats.dom.style.left = '24px';
                        statsPlugin.stats.dom.style.right = 'auto';
                    }
                }
            });

            // Sync loaded state back to UI store
            syncInterval = setInterval(() => {
                if (store.loaded !== mocapPlugin.isLoaded) {
                    store.loaded = mocapPlugin.isLoaded;
                }
            }, 100);

            // Ensure transparent background so video underneath is visible
            viewerStore.setBackgroundColor('transparent');

            // Load face occluder via the plugin once
            mocapPlugin.loadOccluder(headOccluderUrl);

            // 4. Load Models and manage switcher
            let currentModelGroup = null;
            let activeLoadId = 0;

            const loadModel = async (index) => {
                const loadId = ++activeLoadId;
                const modelDef = AVAILABLE_MODELS[index];

                try {
                    const configResult = await EyewearConfigurator.changeModel(viewer, modelDef.url, modelDef.scale || 100);

                    if (loadId !== activeLoadId) {
                        configResult.scene.traverse((child) => {
                            if (child.isMesh) {
                                child.geometry.dispose();
                                if (Array.isArray(child.material)) {
                                    child.material.forEach((m) => m.dispose());
                                } else if (child.material) {
                                    child.material.dispose();
                                }
                            }
                        });
                        return;
                    }

                    // Remove old model
                    if (currentModelGroup) {
                        viewer.scene.remove(currentModelGroup);
                        currentModelGroup.traverse((child) => {
                            if (child.isMesh) {
                                child.geometry.dispose();
                                if (Array.isArray(child.material)) {
                                    child.material.forEach((m) => m.dispose());
                                } else if (child.material) {
                                    child.material.dispose();
                                }
                            }
                        });
                    }

                    if (configAutorun) {
                        configAutorun();
                    }

                    // Scale the model so its maximum bounding box dimension is 5
                    const box = new THREE.Box3().setFromObject(configResult.scene);
                    const size = new THREE.Vector3();
                    box.getSize(size);


                    const maxDim = Math.max(size.x, size.y, size.z);
                    if (maxDim > 0) {
                        const scaleFactor = 5 / maxDim;

                        configResult.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
                    }

                    // Center the model's geometry to ensure it aligns properly with the face anchor
                    // Recompute box after scaling
                    box.setFromObject(configResult.scene);
                    const center = new THREE.Vector3();

                    box.getCenter(center);
                    // Apply manual offsets for face alignment
                    center.y -= 2;
                    center.z += 1;
                    // We shift the scene negatively by the center offset
                    configResult.scene.position.sub(center);

                    // Manually extract all materials from the scene to bypass any configurator filtering
                    const extractedMatNames = [];
                    const extractedMatProps = {};
                    
                    configResult.scene.traverse((child) => {
                        if (child.isMesh && child.material) {
                            const mats = Array.isArray(child.material) ? child.material : [child.material];
                            mats.forEach(mat => {
                                if (!extractedMatNames.includes(mat.name)) {
                                    extractedMatNames.push(mat.name);
                                    extractedMatProps[mat.name] = {
                                        color: '#' + mat.color.getHexString(),
                                        opacity: mat.opacity,
                                        metalness: mat.metalness,
                                        roughness: mat.roughness,
                                        transparent: mat.transparent,
                                        depthWrite: mat.depthWrite
                                    };
                                }
                            });
                        }
                    });

                    store.glassConfigs = {
                        meshes: configResult.meshNames || [],
                        materials: extractedMatNames
                    };

                    const newVisibility = {};
                    configResult.meshNames.forEach(name => {
                        newVisibility[name] = configResult.meshVisibility[name] !== false;
                    });
                    store.meshVisibility = newVisibility;

                    const newProps = {};
                    extractedMatNames.forEach(name => {
                        const baseProps = { ...extractedMatProps[name] };
                        const nameLower = name.toLowerCase();
                        
                        if (nameLower.includes('frame')) {
                            baseProps.transparent = false;
                            baseProps.opacity = 1.0;
                        } else if (nameLower.includes('lens')) {
                            baseProps.transparent = true;
                            baseProps.opacity = 0.5;
                            baseProps.metalness = 0.5;
                            baseProps.roughness = 0.2;
                            baseProps.depthWrite = false;
                        }
                        newProps[name] = baseProps;
                    });
                    store.materialProps = newProps;

                    configAutorun = autorun(() => {
                        configResult.configurableMeshes.forEach(mesh => {
                            if (store.meshVisibility[mesh.name] !== undefined) {
                                mesh.visible = store.meshVisibility[mesh.name];
                            }
                        });

                        // Ensure autorun triggers for all extracted materials
                        configResult.scene.traverse((child) => {
                            if (child.isMesh && child.material) {
                                const mats = Array.isArray(child.material) ? child.material : [child.material];
                                mats.forEach(mat => {
                                    const props = store.materialProps[mat.name];
                                    if (props) {
                                        if (props.color) mat.color.set(props.color);
                                        if (props.roughness !== undefined) mat.roughness = props.roughness;
                                        if (props.metalness !== undefined) mat.metalness = props.metalness;
                                        if (props.transparent !== undefined) mat.transparent = props.transparent;
                                        if (props.depthWrite !== undefined) mat.depthWrite = props.depthWrite;
                                        if (mat.transparent && props.opacity !== undefined) mat.opacity = props.opacity;
                                        mat.needsUpdate = true;
                                    }
                                });
                            }
                        });
                    });

                    const group = new THREE.Group();
                    group.add(configResult.scene);
                    currentModelGroup = group;

                    viewer.scene.add(group);
                    mocapPlugin.registerModel({
                        id: 'glasses',
                        model: group,
                        scale: 1,
                        hasMorphTargets: false
                    });

                    store.avatar = 'glasses';
                } catch (e) {
                    console.error("Failed to load glasses model:", e);
                }
            };

            modelIndexAutorun = autorun(() => {
                loadModel(store.modelIndex);
            });

            const resizeObserver = new ResizeObserver(() => {
                if (viewerRef.current && viewerRef.current.handleResize) {
                    viewerRef.current.handleResize();
                }
            });
            resizeObserver.observe(mountRef.current);

            return () => {
                if (syncInterval) clearInterval(syncInterval);
                if (videoAutorun) videoAutorun();
                if (modelIndexAutorun) modelIndexAutorun();
                if (configAutorun) configAutorun();
                resizeObserver.disconnect();
                if (viewerRef.current) {
                    viewerRef.current.dispose();
                }
            };

        } catch (err) {
            console.error("ThreeD Error:", err);
        }
    }, []);

    return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }} />;
};

export default ThreeD;
