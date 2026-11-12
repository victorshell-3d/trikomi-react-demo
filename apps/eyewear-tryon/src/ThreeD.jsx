/* eslint-disable */
import _React, { useEffect, useRef } from 'react';
import { autorun } from 'mobx';
import * as THREE from 'three/webgpu';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import store from "./Store";
import { ThreeViewer, viewerStore, GLTFPlugin, StatsPlugin } from '@trikomi/core';
import { EyewearPlugin } from '@trikomi/core/eyewear';
import { FaceMocapPlugin } from '@trikomi/core/face-mocap';
const glassesUrl = `${import.meta.env.BASE_URL}models/glasses1.glb`;
const glasses2Url = `${import.meta.env.BASE_URL}models/glasses2.glb`;
const glasses3Url = `${import.meta.env.BASE_URL}models/glasses3.glb`;
const glasses4Url = `${import.meta.env.BASE_URL}models/glasses4.glb`;
const glasses5Url = `${import.meta.env.BASE_URL}models/glasses5.glb`;
const glasses6Url = `${import.meta.env.BASE_URL}models/glasses6.glb`;
const headOccluderUrl = `${import.meta.env.BASE_URL}models/head_occluder.obj`;
const envMapUrl = `${import.meta.env.BASE_URL}images/brown_photostudio_02.webp`;

export const AVAILABLE_MODELS = [
    { name: 'Aviator Classic', url: glassesUrl, thumb: `${import.meta.env.BASE_URL}thumbs/glasses1.png`, scale: 0.3 },
    { name: 'Sport Wrap', url: glasses2Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses2.png`, scale: 0.3 },
    { name: 'Wayfarer Style', url: glasses3Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses3.png`, scale: 0.3 },
    { name: 'Round Metal', url: glasses4Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses4.png`, scale: 0.3 },
    { name: 'Clubmaster', url: glasses5Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses5.png`, scale: 0.3 },
    { name: 'Hexagonal', url: glasses6Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses6.png`, scale: 0.3 }
];

import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

const wasmBase = `${import.meta.env.BASE_URL}assets/wasm`.replace(/\/+/g, '/').replace(':/', '://');
const modelTaskPath = `${import.meta.env.BASE_URL}ml/face_landmarker.task`.replace(/\/+/g, '/').replace(':/', '://');

export const mocapPlugin = new FaceMocapPlugin(wasmBase);
mocapPlugin.smoothStep = 0.5; // Ensure smoothStep is defined for lerping

// Override initFaceLandmarker to dynamically support base URL pathing and GPU-to-CPU fallback
mocapPlugin.initFaceLandmarker = async function () {
    try {
        const filesetResolver = await FilesetResolver.forVisionTasks(wasmBase);
        let landmarker;
        try {
            landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: modelTaskPath,
                    delegate: 'GPU'
                },
                outputFacialTransformationMatrixes: true,
                outputFaceBlendshapes: true,
                runningMode: 'VIDEO',
                numFaces: 1
            });
        } catch (gpuErr) {
            console.warn('[FaceMocapPlugin] GPU delegate failed, falling back to CPU:', gpuErr);
            landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: modelTaskPath,
                    delegate: 'CPU'
                },
                outputFacialTransformationMatrixes: true,
                outputFaceBlendshapes: true,
                runningMode: 'VIDEO',
                numFaces: 1
            });
        }
        this.faceLandmarker = landmarker;
        this.isLoaded = true;
    } catch (err) {
        console.error('[FaceMocapPlugin] Failed to initialize FaceLandmarker:', err);
    }
};

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

            // 2. Ensure GLTFPlugin and EyewearPlugin are attached
            if (!viewer.getPlugin(GLTFPlugin)) {
                viewer.addPlugin(new GLTFPlugin());
            }
            let eyewearPlugin = viewer.getPlugin(EyewearPlugin);
            if (!eyewearPlugin) {
                eyewearPlugin = new EyewearPlugin();
                viewer.addPlugin(eyewearPlugin);
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

            // Ensure transparent background so video underneath is visible
            viewerStore.setBackgroundColor('transparent');

            // Occluder Materials:
            // Standard 3D Try-On Depth Masking: writes to depth buffer before glasses render, zero color write
            const headOcclusionMaterial = new THREE.MeshBasicMaterial({
                colorWrite: false,
                depthWrite: true,
            });
            const wireframeDebugMaterial = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0x00ffcc,
                transparent: true,
                opacity: 0.85,
                depthWrite: true,
            });
            const referenceWireframeMaterial = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 0x666688,
                transparent: true,
                opacity: 0.35,
                depthWrite: false,
            });

            // Procedural Faceted Head Occluder (Fitted strictly inside temples with exact 5mm gap)
            // Eyewear temples sit at X = +-7.15 cm; occluder width of 13.3 cm (X = +-6.65 cm) gives exact 5mm gap
            const headShape = new THREE.Shape();
            const halfWidth = 6.45;   // with 0.2cm bevel reaches max X = +-6.65 cm (exact 5mm gap to temples)
            const zBack = -11.0;      // Back of head/cranium
            const zSide = 0.5;        // Side corner where temples run past cheeks towards ears
            const zPeak = 4.8;        // Front nose/face apex (sits snugly behind glasses frame front at 6.4 cm)

            headShape.moveTo(-halfWidth, zBack);
            headShape.lineTo(halfWidth, zBack);
            headShape.lineTo(halfWidth, zSide);
            headShape.lineTo(0, zPeak);
            headShape.lineTo(-halfWidth, zSide);
            headShape.closePath();

            const extrudeSettings = {
                depth: 17.0,          // Vertical cranial height spanning chin to crown
                bevelEnabled: true,
                bevelSegments: 4,
                steps: 1,
                bevelSize: 0.2,
                bevelThickness: 0.2
            };

            const cranialGeo = new THREE.ExtrudeGeometry(headShape, extrudeSettings);
            cranialGeo.rotateX(Math.PI / 2); // Orient vertical extrusion along Y
            cranialGeo.computeBoundingBox();
            const cbb = cranialGeo.boundingBox;
            // Center X at 0, align Y center at -0.55 cm (matches MediaPipe face landmark center)
            cranialGeo.translate(-(cbb.max.x + cbb.min.x) / 2, -0.55 - (cbb.max.y + cbb.min.y) / 2, 0);
            cranialGeo.computeVertexNormals();

            const cranialOccluderMesh = new THREE.Mesh(
                cranialGeo,
                store.showOccluderWireframe ? wireframeDebugMaterial : headOcclusionMaterial
            );
            cranialOccluderMesh.name = 'CranialVolumeOccluder';
            cranialOccluderMesh.position.set(0, 0, 0); // Position already centered and aligned in geometry
            cranialOccluderMesh.renderOrder = -1;

            // Load face occluder STRICTLY for visual reference only (does not occlude)
            mocapPlugin.loadOccluder(headOccluderUrl).then(mesh => {
                if (mesh) {
                    mesh.material = referenceWireframeMaterial;
                    mesh.renderOrder = 0;
                }
            });

            // 4. Create dummy procedural glasses (locked as reference, hidden by default)
            const dummyGlasses = new THREE.Group();
            dummyGlasses.name = 'DummyGlassesReference';
            dummyGlasses.visible = false; // Controlled by store.showDummyGlasses

            const frameMat = new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.3,
                metalness: 0.8
            });
            const lensMat = new THREE.MeshStandardMaterial({
                color: 0x00e5ff,
                transparent: true,
                opacity: 0.45,
                roughness: 0.1,
                metalness: 0.9
            });

            const rimRadius = 1.6;
            const rimThickness = 0.15;
            const rimDepth = 0.35;
            const zFrontClearance = 5.6;

            const leftRimOuterGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, rimDepth, 32);
            leftRimOuterGeo.rotateX(Math.PI / 2);
            const leftRim = new THREE.Mesh(leftRimOuterGeo, frameMat);
            leftRim.position.set(-3.2, 2.5, zFrontClearance);
            dummyGlasses.add(leftRim);

            const leftLensGeo = new THREE.CylinderGeometry(rimRadius - rimThickness, rimRadius - rimThickness, 0.1, 32);
            leftLensGeo.rotateX(Math.PI / 2);
            const leftLens = new THREE.Mesh(leftLensGeo, lensMat);
            leftLens.position.set(-3.2, 2.5, zFrontClearance);
            dummyGlasses.add(leftLens);

            const rightRimOuterGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, rimDepth, 32);
            rightRimOuterGeo.rotateX(Math.PI / 2);
            const rightRim = new THREE.Mesh(rightRimOuterGeo, frameMat);
            rightRim.position.set(3.2, 2.5, zFrontClearance);
            dummyGlasses.add(rightRim);

            const rightLensGeo = new THREE.CylinderGeometry(rimRadius - rimThickness, rimRadius - rimThickness, 0.1, 32);
            rightLensGeo.rotateX(Math.PI / 2);
            const rightLens = new THREE.Mesh(rightLensGeo, lensMat);
            rightLens.position.set(3.2, 2.5, zFrontClearance);
            dummyGlasses.add(rightLens);

            const bridgeGeo = new THREE.BoxGeometry(1.6, 0.25, 0.3);
            const bridge = new THREE.Mesh(bridgeGeo, frameMat);
            bridge.position.set(0, 2.7, zFrontClearance + 0.1);
            dummyGlasses.add(bridge);

            const templeLength = 9.2;
            const templeGeo = new THREE.BoxGeometry(0.2, 0.3, templeLength);
            const leftTemple = new THREE.Mesh(templeGeo, frameMat);
            leftTemple.position.set(-5.4, 2.5, zFrontClearance - templeLength / 2);
            leftTemple.rotation.y = 0.045;
            dummyGlasses.add(leftTemple);

            const rightTemple = new THREE.Mesh(templeGeo, frameMat);
            rightTemple.position.set(5.4, 2.5, zFrontClearance - templeLength / 2);
            rightTemple.rotation.y = -0.045;
            dummyGlasses.add(rightTemple);

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

                // Occlusion: cranialOccluderMesh is the SOLE active occluder
                // faceOccluderMesh is reference only (visible strictly when showOccluderWireframe is on)
                mocapPlugin.occluderVisible = !!store.showOccluderWireframe;
                const targetMat = store.showOccluderWireframe ? wireframeDebugMaterial : headOcclusionMaterial;

                if (mocapPlugin.faceOccluderMesh) {
                    mocapPlugin.faceOccluderMesh.visible = !!store.showOccluderWireframe;
                    mocapPlugin.faceOccluderMesh.material = referenceWireframeMaterial;
                }

                if (cranialOccluderMesh.material !== targetMat) {
                    cranialOccluderMesh.material = targetMat;
                }
                cranialOccluderMesh.visible = true;

                dummyGlasses.visible = !!store.showDummyGlasses;

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

            // 5. Load Real Eyewear Models aligned with locked front-face bounding box
            let activeLoadId = 0;
            const loadModel = async (index) => {
                const loadId = ++activeLoadId;
                const modelDef = AVAILABLE_MODELS[index];

                try {
                    const glassesNode = await eyewearPlugin.loadModel(modelDef.url);
                    if (loadId !== activeLoadId) return;

                    if (configAutorun) {
                        configAutorun();
                        configAutorun = null;
                    }

                    // Extract parts from the plugin's strongly typed EyewearMeshNodes
                    const meshNodes = eyewearPlugin.meshNodes;
                    const frameNodes = eyewearPlugin.frameNodes;
                    const lensNodes = eyewearPlugin.lensNodes;

                    const extractedMatNames = [];
                    if (frameNodes.length > 0) extractedMatNames.push('Frame');
                    if (lensNodes.length > 0) extractedMatNames.push('Lens');

                    store.glassConfigs = {
                        meshes: meshNodes.map(m => m.name),
                        materials: extractedMatNames
                    };

                    const newVisibility = {};
                    meshNodes.forEach(m => {
                        newVisibility[m.name] = m.visible;
                    });
                    store.meshVisibility = newVisibility;

                    const newProps = {};
                    if (frameNodes.length > 0) {
                        const firstFrameMat = frameNodes[0].eyewearMaterial;
                        newProps['Frame'] = {
                            color: firstFrameMat.color,
                            opacity: firstFrameMat.opacity,
                            metalness: firstFrameMat.metalness,
                            roughness: firstFrameMat.roughness,
                            transparent: firstFrameMat.transparent,
                        };
                    }
                    if (lensNodes.length > 0) {
                        const firstLensMat = lensNodes[0].eyewearMaterial;
                        newProps['Lens'] = {
                            color: firstLensMat.color,
                            opacity: firstLensMat.opacity,
                            metalness: firstLensMat.metalness,
                            roughness: firstLensMat.roughness,
                            transparent: firstLensMat.transparent,
                        };
                    }
                    store.materialProps = newProps;

                    // Bind reactive updates via EyewearPlugin APIs
                    configAutorun = autorun(() => {
                        // Visibility sync
                        meshNodes.forEach(meshNode => {
                            if (store.meshVisibility[meshNode.name] !== undefined) {
                                meshNode.visible = store.meshVisibility[meshNode.name];
                            }
                        });

                        // Frame material sync
                        if (store.materialProps['Frame']) {
                            const fp = store.materialProps['Frame'];
                            eyewearPlugin.setFrameColor(fp.color, {
                                roughness: fp.roughness,
                                metalness: fp.metalness,
                                opacity: fp.opacity
                            });
                        }

                        // Lens material sync
                        if (store.materialProps['Lens']) {
                            const lp = store.materialProps['Lens'];
                            eyewearPlugin.setLensColor(lp.color, {
                                opacity: lp.opacity,
                                roughness: lp.roughness,
                                metalness: lp.metalness
                            });
                        }
                    });

                    // Register with mocap plugin using native Object3D root
                    glassesNode.nativeObject.add(dummyGlasses);
                    glassesNode.nativeObject.add(cranialOccluderMesh);

                    mocapPlugin.registerModel({
                        id: 'glasses',
                        model: glassesNode.nativeObject,
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
