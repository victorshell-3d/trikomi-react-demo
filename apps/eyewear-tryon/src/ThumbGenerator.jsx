import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AVAILABLE_MODELS } from './ThreeD';

const ThumbGenerator = () => {
    const [thumbs, setThumbs] = useState([]);

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(100, 100);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        // Slightly zoomed out camera (z=6 instead of z=5)
        camera.position.set(0, 0, 6.5);

        const ambient = new THREE.AmbientLight(0xffffff, 2.0);
        scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 1.5);
        directional.position.set(2, 2, 3);
        scene.add(directional);

        const loader = new GLTFLoader();
        const generatedThumbs = [];

        const loadNext = async (index) => {
            if (index >= AVAILABLE_MODELS.length) {
                setThumbs(generatedThumbs);
                renderer.dispose();
                return;
            }

            const modelDef = AVAILABLE_MODELS[index];
            loader.load(modelDef.url, (gltf) => {
                const model = gltf.scene;
                
                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                box.getSize(size);
                
                const maxDim = Math.max(size.x, size.y, size.z);
                // Zoomed out slightly (from 3.2 to 2.8)
                const scale = 2.8 / maxDim; 
                model.scale.set(scale, scale, scale);
                model.updateMatrixWorld(true);

                box.setFromObject(model);
                const center = new THREE.Vector3();
                box.getCenter(center);
                // Shift the model so its geometric center is precisely at its local origin
                model.position.sub(center);

                // Create a pivot group so rotations happen around the geometric center
                const pivotGroup = new THREE.Group();
                pivotGroup.add(model);

                model.traverse(child => {
                    if (child.isMesh && child.material) {
                        const mName = child.material.name.toLowerCase();
                        if (mName.includes('lens')) {
                            child.material.transparent = true;
                            child.material.opacity = 0.6;
                            child.material.metalness = 0.5;
                            child.material.roughness = 0.2;
                            child.material.depthWrite = false;
                        } else if (mName.includes('frame')) {
                            child.material.transparent = false;
                            child.material.opacity = 1.0;
                        }
                    }
                });

                // Perfect isometric angle applied to the pivot group
                pivotGroup.rotation.y = -Math.PI / 6; 
                pivotGroup.rotation.x = Math.PI / 12; 

                scene.add(pivotGroup);
                renderer.render(scene, camera);
                
                generatedThumbs.push({
                    name: modelDef.name,
                    url: renderer.domElement.toDataURL('image/png')
                });

                scene.remove(pivotGroup);
                
                // Process next model
                loadNext(index + 1);
            });
        };

        loadNext(0);

    }, []);

    return (
        <div style={{ padding: '40px', minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif' }}>Thumb Generator</h2>
            <p style={{ color: '#8b8b9c' }}>100x100 transparent PNG thumbnails (Perfectly Centered & Zoomed Out)</p>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '40px' }}>
                {thumbs.map(t => (
                    <div key={t.name} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                        <div style={{ 
                            width: 100, height: 100, margin: '0 auto',
                            background: 'repeating-conic-gradient(rgba(255,255,255,0.1) 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <img src={t.url} alt={t.name} width={100} height={100} />
                        </div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '15px 0 10px' }}>{t.name}</p>
                        <a href={t.url} download={`${t.name.replace(/\s+/g, '_').toLowerCase()}.png`} style={{ 
                            fontSize: '0.75rem', 
                            background: '#a855f7', 
                            color: 'white', 
                            padding: '4px 10px', 
                            borderRadius: '4px',
                            textDecoration: 'none'
                        }}>
                            Download
                        </a>
                    </div>
                ))}
            </div>
            {thumbs.length === 0 && <p style={{ color: '#a855f7', marginTop: '40px' }}>Rendering 3D models...</p>}
        </div>
    );
};

export default ThumbGenerator;
