/* eslint-disable */
import store from "./Store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  AppHeaderBar,
  FloatingControlDock,
  CanvasControlToolbar,
  useVictorShellTheme
} from "@trikomi/ui-kit";
import EighthWallInspector from "./EighthWallInspector";
import WebARHelpModal from "./WebARHelpModal";

const spinnerSvg = `${import.meta.env.BASE_URL}svgs/spinner.svg`;

const glassesUrl = `${import.meta.env.BASE_URL}models/glasses1.glb`;
const glasses2Url = `${import.meta.env.BASE_URL}models/glasses2.glb`;
const glasses3Url = `${import.meta.env.BASE_URL}models/glasses3.glb`;
const glasses4Url = `${import.meta.env.BASE_URL}models/glasses4.glb`;
const glasses5Url = `${import.meta.env.BASE_URL}models/glasses5.glb`;
const glasses6Url = `${import.meta.env.BASE_URL}models/glasses6.glb`;

export const AVAILABLE_MODELS = [
    { name: 'Aviator Classic', url: glassesUrl, thumb: `${import.meta.env.BASE_URL}thumbs/glasses1.png`, scale: 0.3 },
    { name: 'Sport Wrap', url: glasses2Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses2.png`, scale: 0.3 },
    { name: 'Wayfarer Style', url: glasses3Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses3.png`, scale: 0.3 },
    { name: 'Round Metal', url: glasses4Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses4.png`, scale: 0.3 },
    { name: 'Clubmaster', url: glasses5Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses5.png`, scale: 0.3 },
    { name: 'Hexagonal', url: glasses6Url, thumb: `${import.meta.env.BASE_URL}thumbs/glasses6.png`, scale: 0.3 }
];

const MediaSelector = observer(() => {
    // VictorShell Theme Integration (Default: Orchid Glow)
    let themeContext = null;
    try {
        themeContext = useVictorShellTheme();
    } catch {}
    const [localTheme, setLocalTheme] = useState('orchid');
    const activeAccent = themeContext ? themeContext.accent : localTheme;
    const setActiveAccent = themeContext ? themeContext.setAccent : setLocalTheme;

    // Viewport responsiveness & Inspector Drawer state (collapsed by default on mobile)
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : false);
    const [activeDockTab, setActiveDockTab] = useState('models');
    const [helpOpen, setHelpOpen] = useState(false);

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

    const handleSelectModel = (idx) => {
        store.modelIndex = idx;
    };

    const handleApplyColor = (type, hex, colorName) => {
        for (const matName of store.glassConfigs.materials || []) {
            const isMatch = type === 'frame'
                ? matName.toLowerCase().includes('frame')
                : matName.toLowerCase().includes('lens');

            if (isMatch) {
                const p = { ...(store.materialProps[matName] || {}) };
                p.color = hex;
                if (colorName === 'Clear') {
                    p.opacity = 0.5;
                    p.transparent = true;
                } else if (type === 'lens') {
                    p.opacity = 0.75;
                } else {
                    p.opacity = 1.0;
                }
                store.materialProps[matName] = p;

                if (window.applyMaterialColor) {
                    window.applyMaterialColor(matName, hex);
                }
            }
        }
    };

    const dockItems = [
        { id: 'models', label: 'Styles', icon: '👓', badge: AVAILABLE_MODELS.length },
        { id: 'frames', label: 'Frames', icon: '🎨' },
        { id: 'lenses', label: 'Lenses', icon: '🕶️' },
        { id: 'webar', label: 'WebAR', icon: '🌐', badge: store.tracking ? 'ON' : undefined },
        { id: 'info', label: 'Info', icon: '📋' }
    ];

    return (
        <div className="viewer-wrapper" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 10 }}>

            {/* Loading Overlay */}
            {!store.loaded && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    inset: 0,
                    zIndex: 99,
                    background: 'rgba(0, 0, 0, 0.85)',
                    color: 'var(--accent, #c084fc)',
                    pointerEvents: 'auto'
                }}>
                    <img src={spinnerSvg} width={60} alt="Loading..." style={{ marginBottom: '15px' }} />
                    <div style={{ letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>
                        INITIALIZING 8THWALL ENGINE
                    </div>
                </div>
            )}

            {/* VictorShell Overlay Layer: non-blocking pointer events pass through to #xr-canvas */}
            <div
                className="vs-8theye-ui-layer"
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
                        productTitle="8thWall WebAR Eyewear"
                        backLabel="← Back to Overview"
                        onBack={() => {
                            window.location.hash = '#/';
                        }}
                        theme={activeAccent}
                        onThemeChange={setActiveAccent}
                        showThemeSwitcher={true}
                        statusBadge={
                            <span
                                className="vs-8theye-status-badge"
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
                                {store.tracking ? 'Face Tracked • 8thWall' : 'Align Face • WebAR'}
                            </span>
                        }
                    />
                </div>

                {/* 2. Top-Right Canvas Control Toolbar */}
                <div style={{ pointerEvents: 'auto' }}>
                    <CanvasControlToolbar
                        position="top-right"
                        extraActions={
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    className="vs-toolbar-btn"
                                    onClick={() => { store.grid = !store.grid; }}
                                    style={{
                                        background: store.grid ? 'var(--accent, #c084fc)' : 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '11.5px',
                                        cursor: 'pointer'
                                    }}
                                    title="Toggle Face Mesh & Occluder Grid"
                                >
                                    🌐 Grid
                                </button>
                                <button
                                    type="button"
                                    className="vs-toolbar-btn"
                                    onClick={() => { store.naturalLighting = !store.naturalLighting; }}
                                    style={{
                                        background: store.naturalLighting ? 'var(--accent, #c084fc)' : 'rgba(255, 255, 255, 0.08)',
                                        color: '#ffffff',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '11.5px',
                                        cursor: 'pointer'
                                    }}
                                    title="Toggle Natural Lighting Simulation"
                                >
                                    💡 Light
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
                            setIsInspectorOpen(true);
                        }}
                    />
                </div>

                {/* 4. Glass Inspector Drawer */}
                <div style={{ pointerEvents: 'auto' }}>
                    <EighthWallInspector
                        isOpen={isInspectorOpen}
                        onClose={() => setIsInspectorOpen(false)}
                        activeTab={activeDockTab}
                        onTabChange={setActiveDockTab}
                        models={AVAILABLE_MODELS}
                        activeModelIndex={store.modelIndex}
                        onSelectModel={handleSelectModel}
                        onApplyColor={handleApplyColor}
                        onOpenHelp={() => setHelpOpen(true)}
                    />
                </div>

                {/* 5. WebAR Help Modal */}
                <div style={{ pointerEvents: 'auto' }}>
                    <WebARHelpModal
                        isOpen={helpOpen}
                        onClose={() => setHelpOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
});

export default MediaSelector;
