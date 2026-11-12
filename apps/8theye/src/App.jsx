import React, { useEffect, useRef } from 'react';
import { autorun } from 'mobx';
import store from './Store';
import EyewearUI, { AVAILABLE_MODELS } from './EyewearUI';
import { EighthWallSDK } from '@trikomi/core/8thwall';
import { ThreeViewer, viewerStore } from '@trikomi/core';
import './index.css';

const App = () => {
    const viewerMountRef = useRef(null);

    useEffect(() => {
        store.isArActive = true;
        let viewer;
        if (viewerMountRef.current) {
            viewer = new ThreeViewer(viewerMountRef.current, viewerStore);
            viewerStore.setBackgroundColor('transparent');
            if (typeof viewer.play === 'function') {
                viewer.play();
            }
        }

        const occluderUrl = (import.meta.env.BASE_URL + 'models/head-occluder.glb').replace('//', '/');
        const sdk = new EighthWallSDK(store, AVAILABLE_MODELS, viewer, occluderUrl);

        const waitForXR8 = setInterval(() => {
            if (window.XR8) {
                clearInterval(waitForXR8);
                sdk.initialize().then(() => {
                    sdk.changeModel(store.modelIndex);
                });
            }
        }, 200);

        let prevModelIndex = store.modelIndex;
        const mainDisposer = autorun(() => {
            const index = store.modelIndex;
            if (index !== prevModelIndex) {
                prevModelIndex = index;
                sdk.changeModel(index);
            }
        });

        window.applyMaterialColor = (matName, colorHex) => {
            sdk.changeColor(matName, colorHex);
        };

        return () => {
            clearInterval(waitForXR8);
            mainDisposer();
            sdk.stop();
            if (viewer) {
                viewer.dispose();
            }
        };
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
            <div ref={viewerMountRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
                <EyewearUI />
            </div>
        </div>
    );
};

export default App;
