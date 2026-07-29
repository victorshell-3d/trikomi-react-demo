/* eslint-disable */
// import Booster from './Booster'
import store from "./Store";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import ThreeD from "./ThreeD";
import LiveLink from "./LiveLink";
const spinnerSvg = `${import.meta.env.BASE_URL}svgs/spinner.svg`;


const _videoWidth = Math.min(480, window.innerWidth * .8);

const MediaSelector = observer(() => {
    const vidRef = useRef(0);
    const fileRef = useRef(0);
    const canvasRef = useRef(0);
    const [panelOpen, setPanelOpen] = useState(true);
    const [containerStyle, setContainerStyle] = useState({ width: '100%', height: '100%' });

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
                            const _vw = vidRef.current.videoWidth;
                            const _vh = vidRef.current.videoHeight;
                            updateLayout();
                        }}
                        ref={vidRef}
                    ></video>
                </div>
            </div>

            {/* Floating Side Panel */}
            <div className={`glass-panel floating-panel ${panelOpen ? 'panel-open' : ''}`}>

                {/* Toggle Button attached to the left side */}
                <button
                    className="panel-toggle-btn"
                    onClick={() => setPanelOpen(!panelOpen)}
                    title="Toggle Controls"
                >
                    {panelOpen ? '▶' : '◀'}
                </button>

                <div className="floating-panel-content">
                    {/* Header Branding */}
                    <div className="control-section" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <img src={`${import.meta.env.BASE_URL}logos/facemocap.png`} height={40} alt="Face Mocap Logo" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.3))' }} />
                        <h1 style={{ margin: '5px 0 0 0', fontSize: '1.4rem', letterSpacing: '1px', background: 'linear-gradient(to right, #fff, #8b8b9c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Trikomi
                        </h1>
                        <h4 style={{ margin: '3px 0 0 0', fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            Motion Capture
                        </h4>
                    </div>

                    {/* Input Controls */}
                    <div className="control-section">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Camera Source</span>
                        <select
                            className="premium-select"
                            style={{ width: '100%' }}
                            onChange={e => {
                                const val = e.target.value;
                                vidRef.current.setAttribute('src', '');
                                vidRef.current.srcObject = null;

                                if (val === 'video') {
                                    fileRef.current.click();
                                } else if (navigator.mediaDevices) {
                                    navigator.mediaDevices.getUserMedia({ video: { deviceId: val } }).then((stream) => {
                                        vidRef.current.srcObject = stream;
                                    });
                                }
                            }}
                        >
                            <option value="" disabled selected>Select Input Camera</option>
                            {store.cameras.map(device => (
                                <option key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${device.deviceId.substring(0, 5)}`}</option>
                            ))}
                            <option value="video">Load video from file</option>
                        </select>
                    </div>

                    {/* Avatar Selection */}
                    <div className="control-section">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Avatar</span>
                        <select
                            className="premium-select"
                            style={{ width: '100%', marginTop: '5px' }}
                            value={store.avatar}
                            onChange={e => store.avatar = e.target.value}
                        >
                            <option value="raccoon">Raccoon Head</option>
                            <option value="glasses">3D Glasses</option>
                        </select>
                    </div>

                    {/* Settings */}
                    <div className="control-section">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Settings</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem' }}>Tracking Smoother</span>
                            <input
                                type="range"
                                className="premium-range"
                                defaultValue={0.5}
                                min={0.5}
                                max={1}
                                step={0.005}
                                onChange={e => store.smoothStep = parseFloat(e.target.value)}
                            />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                className="premium-checkbox"
                                defaultChecked={store.mirror}
                                onChange={e => store.mirror = e.target.checked}
                            />
                            Mirror View
                        </label>
                    </div>

                    {/* Integration Controls */}
                    <div className="control-section">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Integration</span>
                        <Controls />
                        <LiveLink />
                    </div>

                    {/* Footer Links */}
                    <div className="control-section" style={{ borderBottom: 'none', textAlign: 'center', gap: '15px' }}>
                        <a href="https://youtu.be/np0dIP4I_Vc" target="_blank" rel="noreferrer" className="premium-btn" style={{ display: 'block' }}>
                            ▶ Watch Tutorial
                        </a>
                        <a href="assets/LiveLinkShell.zip" className="premium-btn" style={{ display: 'block', fontSize: '0.8rem' }}>
                            ↓ LiveLinkShell (Windows)
                        </a>
                        <a href="assets/UnityLiveLink.unitypackage" className="premium-btn" style={{ display: 'block', fontSize: '0.8rem' }}>
                            ↓ Unity Package
                        </a>
                    </div>
                </div> {/* End floating-panel-content */}
            </div> {/* End floating-panel */}

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