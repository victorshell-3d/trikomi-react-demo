/* eslint-disable */
import store from "./Store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState, useMemo } from "react";
import ThreeD, { AVAILABLE_MODELS } from "./ThreeD";
import Controls from "./Controls";
import {
  AppHeaderBar,
  FloatingControlDock,
  CanvasControlToolbar,
  useVictorShellTheme
} from "@trikomi/ui-kit";
import EyewearInspector from "./EyewearInspector";

const spinnerSvg = `${import.meta.env.BASE_URL}svgs/spinner.svg`;

const MediaSelector = observer(() => {
    const vidRef = useRef(0);
    const fileRef = useRef(0);
    const canvasRef = useRef(0);
    const carouselRef = useRef(null);
    const [containerStyle, setContainerStyle] = useState({ width: '100%', height: '100%' });

    // VictorShell Theme Integration
    let themeContext = null;
    try {
        themeContext = useVictorShellTheme();
    } catch {}
    const [localTheme, setLocalTheme] = useState('indigo');
    const activeAccent = themeContext ? themeContext.accent : localTheme;
    const setActiveAccent = themeContext ? themeContext.setAccent : setLocalTheme;

    // Viewport responsiveness & Inspector Drawer state
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : false);
    const [activeDockTab, setActiveDockTab] = useState('models');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleViewportChange = (e) => {
            setIsMobile(e.matches);
            if (e.matches) {
                setIsInspectorOpen(false);
            }
        };
        mediaQuery.addEventListener('change', handleViewportChange);
        return () => mediaQuery.removeEventListener('change', handleViewportChange);
    }, []);

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
    }, []);

    const toggleFullscreen = () => {
        if (typeof document === 'undefined') return;
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
            document.exitFullscreen?.().catch(() => {});
        }
    };

    const dockItems = useMemo(() => [
        { id: 'models', label: 'Styles', icon: '👓', badge: AVAILABLE_MODELS.length },
        { id: 'frames', label: 'Frame', icon: '🎨' },
        { id: 'lenses', label: 'Lenses', icon: '🕶️' },
        { id: 'camera', label: 'Camera', icon: '📹' },
        { id: 'debug', label: 'Tools', icon: '⚙️' }
    ], []);

    const handleDockSelect = (tabId) => {
        setActiveDockTab(tabId);
        if (!isInspectorOpen) {
            setIsInspectorOpen(true);
        }
    };

    const currentModel = AVAILABLE_MODELS[store.modelIndex] || AVAILABLE_MODELS[0];

    return (
        <div className="viewer-wrapper">
            {/* Fullscreen Video and Canvas */}
            {!store.loaded && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.85)', color: 'var(--accent)', backdropFilter: 'blur(12px)' }}>
                    <img src={spinnerSvg} width={60} alt="Loading..." style={{ marginBottom: '15px' }} />
                    <div style={{ letterSpacing: '2px', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>INITIALIZING EYEWEAR AR ENGINE</div>
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
                            updateLayout();
                        }}
                        ref={vidRef}
                    ></video>
                </div>
            </div>

            {/* VictorShell AppHeaderBar Overlay */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <AppHeaderBar
                        brandTitle="TRIKOMI"
                        productTitle="EYEWEAR AR STUDIO"
                        backLabel="← Back to Overview"
                        onBack={() => {
                            window.location.hash = '#/';
                        }}
                        theme={activeAccent}
                        onThemeChange={setActiveAccent}
                        showThemeSwitcher={true}
                        statusBadge={
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.8rem',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: 'rgba(255, 255, 255, 0.9)'
                                }}
                            >
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                                {currentModel.name}
                            </span>
                        }
                        actions={
                            <button
                                type="button"
                                className="vs-btn vs-btn-secondary"
                                style={{
                                    padding: '6px 14px',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                onClick={() => setIsInspectorOpen(prev => !prev)}
                                aria-label="Toggle Eyewear Drawer"
                            >
                                <span>{isInspectorOpen ? '✕ Hide Drawer' : '☰ Eyewear Drawer'}</span>
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Top-Right Canvas Control Toolbar */}
            <div style={{ position: 'fixed', top: '76px', right: '20px', zIndex: 90 }}>
                <CanvasControlToolbar
                    position="top-right"
                    extraActions={
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                            <button
                                type="button"
                                className={`vs-btn vs-btn-icon ${store.mirror ? 'vs-btn--active' : ''}`}
                                onClick={() => { store.mirror = !store.mirror; }}
                                title={store.mirror ? 'Disable Mirror View' : 'Enable Mirror View'}
                                aria-label="Toggle Mirror View"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: store.mirror ? 'var(--vs-accent-primary, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    cursor: 'pointer'
                                }}
                            >
                                🪞
                            </button>
                            <button
                                type="button"
                                className={`vs-btn vs-btn-icon ${store.showOccluderWireframe ? 'vs-btn--active' : ''}`}
                                onClick={() => { store.showOccluderWireframe = !store.showOccluderWireframe; }}
                                title={store.showOccluderWireframe ? 'Hide Occluder Wireframe' : 'Show Occluder Wireframe'}
                                aria-label="Toggle Occluder Wireframe"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: store.showOccluderWireframe ? 'var(--vs-accent-primary, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    cursor: 'pointer'
                                }}
                            >
                                📐
                            </button>
                            <button
                                type="button"
                                className={`vs-btn vs-btn-icon ${store.grid ? 'vs-btn--active' : ''}`}
                                onClick={() => { store.grid = !store.grid; }}
                                title={store.grid ? 'Hide Grid' : 'Show Grid'}
                                aria-label="Toggle Grid"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: store.grid ? 'var(--vs-accent-primary, #6366f1)' : 'rgba(255, 255, 255, 0.06)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    cursor: 'pointer'
                                }}
                            >
                                ▦
                            </button>
                            <button
                                type="button"
                                className="vs-btn vs-btn-icon"
                                onClick={toggleFullscreen}
                                title="Toggle Fullscreen"
                                aria-label="Toggle Fullscreen"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    cursor: 'pointer'
                                }}
                            >
                                ⛶
                            </button>
                        </div>
                    }
                />
            </div>

            {/* Quick Model Selector Carousel (Positioned above dock) */}
            <div
                className="bottom-carousel-container"
                style={{
                    position: 'fixed',
                    bottom: '84px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 90
                }}
            >
                <button 
                    className="carousel-arrow"
                    onClick={() => {
                        const len = AVAILABLE_MODELS.length;
                        store.modelIndex = (store.modelIndex - 1 + len) % len;
                    }}
                    aria-label="Previous model"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
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
                    aria-label="Next model"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>

            {/* Floating Control Dock */}
            <FloatingControlDock
                items={dockItems}
                activeId={activeDockTab}
                onSelect={handleDockSelect}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100
                }}
            />

            {/* Glass Inspector Drawer */}
            <EyewearInspector
                isOpen={isInspectorOpen}
                onClose={() => setIsInspectorOpen(false)}
                activeTab={activeDockTab}
                onTabChange={setActiveDockTab}
                models={AVAILABLE_MODELS}
                activeModelIndex={store.modelIndex}
                onSelectModel={(idx) => { store.modelIndex = idx; }}
                store={store}
            />

            <input
                onChange={e => {
                    if (e.target.files.length > 0) {
                        const fileURL = URL.createObjectURL(e.target.files[0]);
                        vidRef.current.setAttribute("src", fileURL);
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