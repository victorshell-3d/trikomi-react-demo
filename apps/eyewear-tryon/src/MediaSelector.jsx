/* eslint-disable */
import store from "./Store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import ThreeD, { AVAILABLE_MODELS } from "./ThreeD";
const spinnerSvg = "/svgs/spinner.svg";


const _videoWidth = Math.min(480, window.innerWidth * .8);

const MediaSelector = observer(() => {
    const vidRef = useRef(0);
    const fileRef = useRef(0);
    const canvasRef = useRef(0);
    const carouselRef = useRef(null);
    const [panelOpen, setPanelOpen] = useState(true);
    const [containerStyle, setContainerStyle] = useState({ width: '100%', height: '100%' });

    useEffect(() => {
        if (carouselRef.current && carouselRef.current.children[store.modelIndex]) {
            carouselRef.current.children[store.modelIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [store.modelIndex]);

    const updateLayout = () => {
        if (!vidRef.current) return;
        const vw = vidRef.current.videoWidth;
        const vh = vidRef.current.videoHeight;
        if (!vw || !vh) return;

        if (canvasRef.current) {
            canvasRef.current.width = vw;
            canvasRef.current.height = vh;
        }

        const videoRatio = vw / vh;
        const windowRatio = window.innerWidth / window.innerHeight;

        if (windowRatio > videoRatio) {
            // Screen is wider than video. Fill by width, let height bleed out.
            setContainerStyle({ width: '100vw', height: `${100 / videoRatio}vw` });
        } else {
            // Screen is taller than video. Fill by height, let width bleed out.
            setContainerStyle({ height: '100vh', width: `${100 * videoRatio}vh` });
        }
    };

    useEffect(() => {
        store.camera = vidRef.current;
        if (canvasRef.current) {
            store.canvasElement = canvasRef.current;
        }
        
        store.fetchCameras();

        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                if (vidRef.current) {
                    vidRef.current.srcObject = stream;
                }
            }).catch(err => console.warn('Webcam not accessible', err));
        } else {
            console.warn('navigator.mediaDevices is undefined.');
        }

        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [])

    return (
        <div className="viewer-wrapper">

            {/* Fullscreen Video and Canvas */}
            {!store.loaded && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.8)', color: 'var(--accent)' }}>
                    <img src={spinnerSvg} width={60} alt="Loading..." style={{ marginBottom: '15px' }} />
                    <div style={{ letterSpacing: '2px', fontSize: '0.9rem' }}>INITIALIZING ENGINE</div>
                </div>
            )}

            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'relative',
                    width: containerStyle.width,
                    height: containerStyle.height,
                    transform: store.mirror ? `scaleX(-1)` : `scaleX(1)`,
                    transition: 'transform 0.3s ease'
                }}>
                    <ThreeD />
                    <canvas
                        ref={canvasRef}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 11 }}
                    />
                    <video
                        className="viewer-video"
                        autoPlay
                        playsInline
                        loop
                        muted
                        onLoadedData={_e => {
                            const _vw = vidRef.current.videoWidth;
                            const _vh = vidRef.current.videoHeight;
                            updateLayout();
                        }}
                        ref={vidRef}
                    ></video>
                </div>
            </div>

            {/* Top Header */}
            <div className="app-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/logos/eyewear.png" height={40} alt="Trikomi Logo" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.3))' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Trikomi</span>
                        <span style={{ fontWeight: 400, fontSize: '0.9rem', color: '#a855f7', letterSpacing: '2px', textTransform: 'uppercase' }}>Eyewear</span>
                    </div>
                </div>
                <button className="icon-button" title="Tools">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </button>
            </div>

            {/* Vertical Color Panels */}
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
                                    const p = { ...store.materialProps[matName] };
                                    p.color = c.hex;
                                    // For clear/tortoise we might need to adjust roughness/metalness or opacity
                                    if (c.name === 'Clear') {
                                        p.opacity = 0.5;
                                        p.transparent = true;
                                    } else {
                                        p.opacity = 1.0;
                                    }
                                    if (isLens) {
                                        p.opacity = 0.7; // Lens are typically slightly transparent
                                    }
                                    store.materialProps[matName] = p;
                                }}
                            />
                        ))}
                    </div>
                );
            })}

            {/* Bottom Carousel */}
            <div className="bottom-carousel-container">
                <button 
                    className="carousel-arrow"
                    onClick={() => {
                        const len = AVAILABLE_MODELS.length;
                        store.modelIndex = (store.modelIndex - 1 + len) % len;
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
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
                                <span style={{ fontSize: '0.6rem', color: 'white' }}>{model.name.split(' ')[0]}</span>
                            )}
                        </div>
                    ))}
                </div>
                <button 
                    className="carousel-arrow"
                    onClick={() => {
                        const len = AVAILABLE_MODELS.length;
                        store.modelIndex = (store.modelIndex + 1) % len;
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>

            <input
                onChange={e => {
                    if (e.target.files.length > 0) {
                        const fileURL = URL.createObjectURL(e.target.files[0]);
                        vidRef.current.setAttribute("src", fileURL)
                    }
                }}
                ref={fileRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
            />
        </div>
    );
});

export default MediaSelector;