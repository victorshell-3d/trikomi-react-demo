import React, { useEffect } from 'react';
import { autorun } from 'mobx';
import store from './Store';
import EyewearUI, { AVAILABLE_MODELS } from './EyewearUI';
import { EighthWallSDK } from '@trikomi/core/8thwall';
import './index.css';

const App = () => {
    useEffect(() => {
        store.isArActive = true;
        const sdk = new EighthWallSDK(store, AVAILABLE_MODELS);

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
            mainDisposer();
            sdk.stop();
        };
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
                <EyewearUI />
            </div>
        </div>
    );
};

export default App;
