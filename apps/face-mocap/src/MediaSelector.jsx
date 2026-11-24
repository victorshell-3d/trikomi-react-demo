/* eslint-disable */
import store from "./Store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import ThreeD, { mocapPlugin } from "./ThreeD";
import {
  AppHeaderBar,
  FloatingControlDock,
  CanvasControlToolbar,
  useVictorShellTheme
} from "@trikomi/ui-kit";
import MocapInspector from "./MocapInspector";
import LiveLinkHelpModal from "./LiveLinkHelpModal";

const spinnerSvg = `${import.meta.env.BASE_URL}svgs/spinner.svg`;

const MediaSelector = observer(() => {
    const vidRef = useRef(0);
    const fileRef = useRef(0);
    const canvasRef = useRef(0);
    const [containerStyle, setContainerStyle] = useState({ width: '100%', height: '100%' });

    // VictorShell Theme Integration
    let themeContext = null;
    try {
        themeContext = useVictorShellTheme();
    } catch {}
    const [localTheme, setLocalTheme] = useState('violet');
    const activeAccent = themeContext ? themeContext.accent : localTheme;
    const setActiveAccent = themeContext ? themeContext.setAccent : setLocalTheme;

    // Viewport responsiveness & Inspector Drawer state
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
    const [inspectorOpen, setInspectorOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);
    const [activeDockTab, setActiveDockTab] = useState('avatar');
    const [helpOpen, setHelpOpen] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleViewportChange = (e) => {
            setIsMobile(e.matches);
            if (e.matches) {
                setInspectorOpen(false);
            }
        };
        mediaQuery.addEventListener('change', handleViewportChange);
        return () => mediaQuery.removeEventListener('change', handleViewportChange);
    }, []);

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
            // Screen is wider than video. Constrained by height.
            setContainerStyle({ height: '100vh', width: `${100 * videoRatio}vh` });
        } else {
            // Screen is taller than video. Constrained by width.
            setContainerStyle({ width: '100vw', height: `${100 / videoRatio}vw` });
        }
    };

    useEffect(() => {
        store.camera = vidRef.current;
        if (canvasRef.current) {
            store.canvasElement = canvasRef.current;
        }

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

    const handleCameraChange = (val) => {
        if (!vidRef.current) return;
        vidRef.current.setAttribute('src', '');
        vidRef.current.srcObject = null;

        if (val === 'video') {
            fileRef.current?.click();
        } else if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: { deviceId: val } }).then((stream) => {
                if (vidRef.current) {
                    vidRef.current.srcObject = stream;
                }
            }).catch(err => console.warn('Could not switch camera:', err));
        }
    };

    const handleRecordToggle = () => {
        if (store.recording) {
            store.recording = false;
            mocapPlugin.downloadCSV('BlendshapeData.csv');
        } else {
            store.recording = true;
        }
    };

    const dockItems = [
        { id: 'avatar', label: 'Avatar', icon: '🎭', badge: store.avatar === 'raccoon' ? 'Raccoon' : 'Glasses' },
        { id: 'camera', label: 'Camera', icon: '📷' },
        { id: 'blendshapes', label: 'Blendshapes', icon: '📊', badge: '52' },
        { id: 'livelink', label: 'LiveLink', icon: '🔗', badge: store.connected ? 'ON' : undefined },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className="viewer-wrapper" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

            {/* Fullscreen Video and Canvas */}
            {!store.loaded && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.85)', color: 'var(--accent, #a855f7)' }}>
                    <img src={spinnerSvg} width={60} alt="Loading..." style={{ marginBottom: '15px' }} />
                    <div style={{ letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>INITIALIZING TRACKING ENGINE</div>
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
                    height: containerStyle.height
                }}>
                    <ThreeD />
                    <canvas
                        ref={canvasRef}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 11 }}
                    />
                    <video
                        className="viewer-video"
                        style={{ transform: store.mirror ? 'scaleX(-1)' : 'scaleX(1)', transition: 'transform 0.3s ease' }}
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

            {/* VictorShell Overlay Layer: non-blocking pointer events */}
            <div
                className="vs-mocap-ui-layer"
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 20
                }}
            >
                {/* 1. App Header Bar */}
                <div style={{ pointerEvents: 'auto' }}>
                    <AppHeaderBar
                        brandTitle="TRIKOMI"
                        productTitle="Face Mocap"
                        backLabel="← Back to Overview"
                        onBack={() => {
                            window.location.hash = '#/';
                        }}
                        theme={activeAccent}
                        onThemeChange={setActiveAccent}
                        showThemeSwitcher={true}
                        statusBadge={
                            <span
                                className="vs-mocap-status-badge"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    background: store.tracking ? 'rgba(74, 222, 128, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                    color: store.tracking ? '#4ade80' : '#f59e0b',
                                    border: store.tracking ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                                }}
                            >
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: store.tracking ? '#4ade80' : '#f59e0b'
                                    }}
                                />
                                {store.tracking ? 'Tracking Active • 52 ARKit' : 'Awaiting Face • Ready'}
                            </span>
                        }
                    />
                </div>

                {/* 2. Top-Right Canvas Control Toolbar */}
                <div style={{ pointerEvents: 'auto' }}>
                    <CanvasControlToolbar
                        position="top-right"
                        onRecenter={() => {
                            updateLayout();
                        }}
                        extraActions={
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    className={`vs-toolbar-btn ${store.recording ? 'is-recording' : ''}`}
                                    onClick={handleRecordToggle}
                                    disabled={!store.tracking}
                                    style={{
                                        background: store.recording ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '11.5px',
                                        fontWeight: 600,
                                        cursor: store.tracking ? 'pointer' : 'not-allowed',
                                        opacity: store.tracking ? 1 : 0.5
                                    }}
                                    title={store.recording ? 'Stop Recording CSV' : 'Record CSV'}
                                >
                                    {store.recording ? '⏹ Stop' : '🔴 Rec'}
                                </button>
                                <button
                                    type="button"
                                    className="vs-toolbar-btn"
                                    onClick={() => { store.grid = !store.grid; }}
                                    style={{
                                        background: store.grid ? 'var(--accent, #a855f7)' : 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '11.5px',
                                        cursor: 'pointer'
                                    }}
                                    title="Toggle Face Landmarks Grid"
                                >
                                    🌐 Grid
                                </button>
                                <button
                                    type="button"
                                    className="vs-toolbar-btn"
                                    onClick={() => { store.connected = !store.connected; }}
                                    style={{
                                        background: store.connected ? '#22c55e' : 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '11.5px',
                                        cursor: 'pointer'
                                    }}
                                    title="Toggle LiveLink WebSocket Broadcast"
                                >
                                    🔗 LiveLink
                                </button>
                                <button
                                    type="button"
                                    className="vs-toolbar-btn"
                                    onClick={() => {
                                        if (!document.fullscreenElement) {
                                            document.documentElement.requestFullscreen?.();
                                        } else {
                                            document.exitFullscreen?.();
                                        }
                                    }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '11.5px',
                                        cursor: 'pointer'
                                    }}
                                    title="Fullscreen"
                                >
                                    ⛶
                                </button>
                            </div>
                        }
                    />
                </div>

                {/* 3. Bottom Floating Control Dock */}
                <div style={{ pointerEvents: 'auto' }}>
                    <FloatingControlDock
                        position="bottom"
                        items={dockItems}
                        activeId={activeDockTab}
                        onSelect={(id) => {
                            setActiveDockTab(id);
                            setInspectorOpen(true);
                        }}
                    />
                </div>

                {/* 4. Glass Inspector Drawer */}
                <div style={{ pointerEvents: 'auto' }}>
                    <MocapInspector
                        isOpen={inspectorOpen}
                        onClose={() => setInspectorOpen(false)}
                        activeTab={activeDockTab}
                        onTabChange={setActiveDockTab}
                        onCameraChange={handleCameraChange}
                        onToggleRecord={handleRecordToggle}
                        onOpenHelp={() => setHelpOpen(true)}
                    />
                </div>

                {/* 5. LiveLink Setup Help Modal */}
                <div style={{ pointerEvents: 'auto' }}>
                    <LiveLinkHelpModal
                        isOpen={helpOpen}
                        onClose={() => setHelpOpen(false)}
                    />
                </div>
            </div>

            {/* Hidden Video File Uploader */}
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
