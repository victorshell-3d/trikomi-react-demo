/* eslint-disable */
import store from "./Store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import './EyewearUI.css';

const spinnerSvg = "/svgs/spinner.svg";

const glassesUrl = '/models/glasses1.glb';
const glasses2Url = '/models/glasses2.glb';
const glasses3Url = '/models/glasses3.glb';
const glasses4Url = '/models/glasses4.glb';
const glasses5Url = '/models/glasses5.glb';
const glasses6Url = '/models/glasses6.glb';

export const AVAILABLE_MODELS = [
    { name: 'Aviator Classic', url: glassesUrl, thumb: '/thumbs/glasses1.png', scale: 0.3 },
    { name: 'Sport Wrap', url: glasses2Url, thumb: '/thumbs/glasses2.png', scale: 0.3 },
    { name: 'Wayfarer Style', url: glasses3Url, thumb: '/thumbs/glasses3.png', scale: 0.3 },
    { name: 'Round Metal', url: glasses4Url, thumb: '/thumbs/glasses4.png', scale: 0.3 },
    { name: 'Clubmaster', url: glasses5Url, thumb: '/thumbs/glasses5.png', scale: 0.3 },
    { name: 'Hexagonal', url: glasses6Url, thumb: '/thumbs/glasses6.png', scale: 0.3 }
];

const MediaSelector = observer(() => {
    const carouselRef = useRef(null);

    useEffect(() => {
        if (carouselRef.current && carouselRef.current.children[store.modelIndex]) {
            carouselRef.current.children[store.modelIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [store.modelIndex]);

    return (
        <div className="viewer-wrapper">
            {/* Loading Overlay */}
            {!store.loaded && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.85)', color: '#00f2fe' }}>
                    <img src={spinnerSvg} width={60} alt="Loading..." style={{ marginBottom: '15px' }} />
                    <div style={{ letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>INITIALIZING ENGINE</div>
                </div>
            )}

            {/* Top Header */}
            <div className="app-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/logos/eyewear.png" height={40} alt="Trikomi Logo" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.3))' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Trikomi</span>
                        <span style={{ fontWeight: 400, fontSize: '0.9rem', color: '#a855f7', letterSpacing: '2px', textTransform: 'uppercase' }}>Eyewear</span>
                    </div>
                </div>

            </div>

            {/* Vertical Material Color Panels */}
            {store.glassConfigs.materials.map(matName => {
                const props = store.materialProps[matName];
                if (!props) return null;

                const isFrame = matName.toLowerCase().includes('frame');
                const isLens = matName.toLowerCase().includes('lens');

                if (!isFrame && !isLens) return null;

                const frameColors = [
                    { name: 'Black', hex: '#222222' },
                    { name: 'Tortoise', hex: '#8b4513' },
                    { name: 'Silver', hex: '#e0e0e0' },
                    { name: 'Gold', hex: '#d4af37' },
                    { name: 'Clear', hex: '#ffffff' },
                ];

                const lensColors = [
                    { name: 'Dark', hex: '#111111' },
                    { name: 'Green', hex: '#1d3e2b' },
                    { name: 'Brown', hex: '#4a2f1d' },
                    { name: 'Blue', hex: '#1c2d54' },
                    { name: 'Purple', hex: '#3b1c54' },
                ];

                const presetColors = isFrame ? frameColors : lensColors;

                return (
                    <div key={matName} className={`vertical-panel ${isFrame ? 'left' : 'right'}`}>
                        {presetColors.map(c => (
                            <button
                                key={c.name}
                                className={`swatch-btn ${props.color === c.hex ? 'active' : ''}`}
                                style={{ background: c.hex }}
                                title={c.name}
                                onClick={() => {
                                    if (window.applyMaterialColor) {
                                        window.applyMaterialColor(matName, c.hex);
                                    }
                                }}
                            />
                        ))}
                    </div>
                );
            })}

            {/* Bottom Eyewear Model Selection Carousel */}
            <div className="bottom-carousel-container">
                <button
                    className="carousel-arrow"
                    onClick={() => {
                        const newIdx = (store.modelIndex - 1 + AVAILABLE_MODELS.length) % AVAILABLE_MODELS.length;
                        store.modelIndex = newIdx;
                    }}
                >
                    ❮
                </button>
                <div className="carousel-items" ref={carouselRef}>
                    {AVAILABLE_MODELS.map((model, idx) => (
                        <div
                            key={model.name}
                            className={`model-card ${store.modelIndex === idx ? 'active' : ''}`}
                            onClick={() => store.modelIndex = idx}
                            title={model.name}
                        >
                            {model.thumb ? (
                                <img src={model.thumb} alt={model.name} style={{ width: '80%', height: '80%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                            ) : (
                                <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>{model.name.split(' ')[0]}</span>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-arrow"
                    onClick={() => {
                        const newIdx = (store.modelIndex + 1) % AVAILABLE_MODELS.length;
                        store.modelIndex = newIdx;
                    }}
                >
                    ❯
                </button>
            </div>
        </div>
    );
});

export default MediaSelector;