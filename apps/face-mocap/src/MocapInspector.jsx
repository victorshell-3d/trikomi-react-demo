import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { GlassInspectorDrawer } from '@trikomi/ui-kit';
import store, { boosters } from './Store';

// Standard 52 ARKit blendshapes catalog for telemetry & category filtering
const ARKIT_BLENDSHAPES = [
  // Eyes & Brows (19)
  { key: 'EyeBlinkLeft', category: 'eyes' },
  { key: 'EyeLookDownLeft', category: 'eyes' },
  { key: 'EyeLookInLeft', category: 'eyes' },
  { key: 'EyeLookOutLeft', category: 'eyes' },
  { key: 'EyeLookUpLeft', category: 'eyes' },
  { key: 'EyeSquintLeft', category: 'eyes' },
  { key: 'EyeWideLeft', category: 'eyes' },
  { key: 'EyeBlinkRight', category: 'eyes' },
  { key: 'EyeLookDownRight', category: 'eyes' },
  { key: 'EyeLookInRight', category: 'eyes' },
  { key: 'EyeLookOutRight', category: 'eyes' },
  { key: 'EyeLookUpRight', category: 'eyes' },
  { key: 'EyeSquintRight', category: 'eyes' },
  { key: 'EyeWideRight', category: 'eyes' },
  { key: 'BrowDownLeft', category: 'eyes' },
  { key: 'BrowDownRight', category: 'eyes' },
  { key: 'BrowInnerUp', category: 'eyes' },
  { key: 'BrowOuterUpLeft', category: 'eyes' },
  { key: 'BrowOuterUpRight', category: 'eyes' },

  // Mouth & Lips (23)
  { key: 'MouthClose', category: 'mouth' },
  { key: 'MouthFunnel', category: 'mouth' },
  { key: 'MouthPucker', category: 'mouth' },
  { key: 'MouthLeft', category: 'mouth' },
  { key: 'MouthRight', category: 'mouth' },
  { key: 'MouthSmileLeft', category: 'mouth' },
  { key: 'MouthSmileRight', category: 'mouth' },
  { key: 'MouthFrownLeft', category: 'mouth' },
  { key: 'MouthFrownRight', category: 'mouth' },
  { key: 'MouthDimpleLeft', category: 'mouth' },
  { key: 'MouthDimpleRight', category: 'mouth' },
  { key: 'MouthStretchLeft', category: 'mouth' },
  { key: 'MouthStretchRight', category: 'mouth' },
  { key: 'MouthRollLower', category: 'mouth' },
  { key: 'MouthRollUpper', category: 'mouth' },
  { key: 'MouthShrugLower', category: 'mouth' },
  { key: 'MouthShrugUpper', category: 'mouth' },
  { key: 'MouthPressLeft', category: 'mouth' },
  { key: 'MouthPressRight', category: 'mouth' },
  { key: 'MouthLowerDownLeft', category: 'mouth' },
  { key: 'MouthLowerDownRight', category: 'mouth' },
  { key: 'MouthUpperUpLeft', category: 'mouth' },
  { key: 'MouthUpperUpRight', category: 'mouth' },

  // Jaw & Cheeks (7)
  { key: 'JawOpen', category: 'jaw' },
  { key: 'JawForward', category: 'jaw' },
  { key: 'JawLeft', category: 'jaw' },
  { key: 'JawRight', category: 'jaw' },
  { key: 'CheekPuff', category: 'jaw' },
  { key: 'CheekSquintLeft', category: 'jaw' },
  { key: 'CheekSquintRight', category: 'jaw' },

  // Tongue & Nose (3)
  { key: 'TongueOut', category: 'other' },
  { key: 'NoseSneerLeft', category: 'other' },
  { key: 'NoseSneerRight', category: 'other' }
];

const DRAWER_TABS = [
  { id: 'avatar', label: 'Avatar', icon: '🎭' },
  { id: 'camera', label: 'Camera', icon: '📷' },
  { id: 'blendshapes', label: 'Blendshapes', icon: '📊' },
  { id: 'livelink', label: 'LiveLink', icon: '🔗' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

export const MocapInspector = observer(({
  isOpen,
  onClose,
  activeTab = 'avatar',
  onTabChange,
  onCameraChange,
  onToggleRecord,
  onOpenHelp
}) => {
  const [blendshapeCategory, setBlendshapeCategory] = useState('all');

  const filteredBlendshapes = useMemo(() => {
    if (blendshapeCategory === 'all') return ARKIT_BLENDSHAPES;
    return ARKIT_BLENDSHAPES.filter(b => b.category === blendshapeCategory);
  }, [blendshapeCategory]);

  const handleRecordToggle = () => {
    if (onToggleRecord) {
      onToggleRecord();
    } else {
      store.recording = !store.recording;
    }
  };

  const handleResetDefaults = () => {
    store.avatar = 'raccoon';
    store.smoothStep = 0.5;
    store.mirror = true;
    store.grid = false;
    store.booster = false;
  };

  return (
    <GlassInspectorDrawer
      isOpen={isOpen}
      onClose={onClose}
      tabs={DRAWER_TABS}
      activeTab={activeTab}
      onTabChange={onTabChange}
      title="Face Mocap Studio"
      position="right"
      width={380}
      footer={
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{ flex: 1, padding: '7px 12px', fontSize: '12px' }}
            onClick={handleResetDefaults}
          >
            ↺ Reset
          </button>
          <button
            type="button"
            className={`vs-btn ${store.recording ? 'vs-btn-danger' : 'vs-btn-primary'}`}
            style={{ flex: 1, padding: '7px 12px', fontSize: '12px' }}
            onClick={handleRecordToggle}
            disabled={!store.tracking}
          >
            {store.recording ? '⏹ Stop' : '🔴 Record'}
          </button>
          <button
            type="button"
            className="vs-btn vs-btn-secondary"
            style={{
              flex: 1,
              padding: '7px 12px',
              fontSize: '12px',
              borderColor: store.connected ? 'rgba(74, 222, 128, 0.4)' : undefined,
              color: store.connected ? '#4ade80' : undefined
            }}
            onClick={() => { store.connected = !store.connected; }}
          >
            🔗 {store.connected ? 'Live' : 'LiveLink'}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>

        {/* ------------------------------------------------------------------ */}
        {/* Tab 1: Avatar                                                      */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'avatar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Select Virtual Avatar
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Choose an expressive 3D character or accessory for real-time motion capture.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Raccoon Head Card */}
              <div
                onClick={() => { store.avatar = 'raccoon'; }}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: store.avatar === 'raccoon'
                    ? '2px solid var(--accent, #a855f7)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: store.avatar === 'raccoon'
                    ? 'rgba(168, 85, 247, 0.12)'
                    : 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🦝
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                      Raccoon Head
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                      52 ARKit Morph Targets • Expressive
                    </div>
                  </div>
                </div>
                {store.avatar === 'raccoon' && (
                  <span className="vs-badge vs-badge-primary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                    Active
                  </span>
                )}
              </div>

              {/* 3D Glasses Card */}
              <div
                onClick={() => { store.avatar = 'glasses'; }}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: store.avatar === 'glasses'
                    ? '2px solid var(--accent, #a855f7)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: store.avatar === 'glasses'
                    ? 'rgba(168, 85, 247, 0.12)'
                    : 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    👓
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                      3D Glasses
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                      Cranial Occluder • Accessory Try-On
                    </div>
                  </div>
                </div>
                {store.avatar === 'glasses' && (
                  <span className="vs-badge vs-badge-primary" style={{ fontSize: '11px', padding: '3px 8px' }}>
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Avatar Feature Breakdown */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '12px',
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <strong style={{ color: '#fff' }}>Rigging Note:</strong> The Raccoon avatar actively binds to all 52 Apple ARKit blendshape channels simultaneously for high-fidelity facial performance capture.
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 2: Camera & Tracking                                           */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'camera' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Camera & Tracking Inputs
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Select input hardware, mirror feeds, and toggle debug overlays.
              </p>
            </div>

            {/* Camera Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Camera Source
              </label>
              <select
                className="vs-select"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(20, 20, 30, 0.8)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '13px',
                  outline: 'none'
                }}
                onChange={e => onCameraChange?.(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Input Camera</option>
                {store.cameras.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.substring(0, 5)}`}
                  </option>
                ))}
                <option value="video">📁 Load video from file...</option>
              </select>
            </div>

            {/* Viewport Toggles */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px', color: '#ffffff' }}>
                <span>Mirror Camera View</span>
                <input
                  type="checkbox"
                  className="vs-checkbox"
                  checked={store.mirror}
                  onChange={e => { store.mirror = e.target.checked; }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '13px', color: '#ffffff' }}>
                <span>Facial Landmarks & 3D Grid</span>
                <input
                  type="checkbox"
                  className="vs-checkbox"
                  checked={store.grid}
                  onChange={e => { store.grid = e.target.checked; }}
                />
              </label>
            </div>

            {/* Live Detection Telemetry */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: store.tracking ? 'rgba(74, 222, 128, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              border: store.tracking ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: store.tracking ? '#4ade80' : '#f59e0b',
                boxShadow: store.tracking ? '0 0 10px #4ade80' : 'none'
              }} />
              <div style={{ fontSize: '12.5px', color: store.tracking ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>
                {store.tracking ? 'Face Detected' : 'No Face Detected'}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 3: Blendshapes                                                 */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'blendshapes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                52 ARKit Blendshapes (52)
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Real-time facial expression telemetry and multiplier boosters.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All (52)' },
                { id: 'eyes', label: 'Eyes & Brows' },
                { id: 'mouth', label: 'Mouth & Lips' },
                { id: 'jaw', label: 'Jaw & Cheeks' },
                { id: 'other', label: 'Tongue & Nose' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setBlendshapeCategory(cat.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: blendshapeCategory === cat.id ? 'var(--accent, #a855f7)' : 'rgba(255, 255, 255, 0.12)',
                    background: blendshapeCategory === cat.id ? 'var(--accent, #a855f7)' : 'rgba(255, 255, 255, 0.04)',
                    color: blendshapeCategory === cat.id ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Booster Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                  Blendshape Boosters
                </div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.55)' }}>
                  Amplify micro-expressions
                </div>
              </div>
              <input
                type="checkbox"
                className="vs-checkbox"
                checked={store.booster}
                onChange={e => { store.booster = e.target.checked; }}
              />
            </div>

            {/* Scrollable Blendshapes List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '340px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {filteredBlendshapes.map(({ key }) => {
                const rawVal = store.blendshapes[key] || '0.000000';
                const numVal = parseFloat(rawVal) || 0;
                const percent = Math.min(100, Math.max(0, numVal * 100));

                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }} title={key}>
                        {key}
                      </span>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.7)' }}>
                        {numVal.toFixed(2)}
                      </span>
                    </div>

                    {/* Level Bar */}
                    <div style={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)',
                        transition: 'width 0.05s ease-out'
                      }} />
                    </div>

                    {/* Booster Slider if active */}
                    {store.booster && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.5)' }}>Boost:</span>
                        <input
                          type="range"
                          min={0}
                          max={2}
                          step={0.05}
                          defaultValue={boosters[key] !== undefined ? boosters[key] : 1}
                          onChange={e => {
                            boosters[key] = parseFloat(e.target.value);
                          }}
                          style={{ flex: 1, height: '4px' }}
                        />
                        <span style={{ fontSize: '10.5px', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {(boosters[key] !== undefined ? boosters[key] : 1.0).toFixed(2)}x
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 4: LiveLink                                                    */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'livelink' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                LiveLink Engine Streaming
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Broadcast facial animation curves to Unreal Engine & Unity.
              </p>
            </div>

            {/* Server Address Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                WebSocket Server Host
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
                  ws://
                </span>
                <input
                  type="text"
                  className="vs-input"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(20, 20, 30, 0.8)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                  value={store.serverAddress}
                  onChange={e => { store.serverAddress = e.target.value; }}
                />
              </div>
            </div>

            {/* Connection Button */}
            <button
              type="button"
              className={`vs-btn ${store.connected ? 'vs-btn-danger' : 'vs-btn-primary'}`}
              style={{ padding: '10px', fontSize: '13.5px', fontWeight: 700, borderRadius: '8px' }}
              onClick={() => { store.connected = !store.connected; }}
            >
              {store.connected ? 'Disconnect LiveLink' : 'Connect LiveLink'}
            </button>

            {/* Connection Status Badge */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: store.connected ? 'rgba(74, 222, 128, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: store.connected ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px'
            }}>
              <span>{store.connected ? '🟢' : '⚪'}</span>
              <span style={{ color: store.connected ? '#4ade80' : 'rgba(255, 255, 255, 0.6)' }}>
                {store.connected ? `Streaming to ws://${store.serverAddress}` : 'LiveLink Disconnected'}
              </span>
            </div>

            {/* Download Packages Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>
                Engine Bridge Plugins:
              </div>
              <a
                href="downloads/LiveLinkShell.zip"
                download
                className="vs-btn vs-btn-secondary"
                style={{ textAlign: 'center', padding: '8px 12px', fontSize: '12.5px', textDecoration: 'none' }}
              >
                ↓ LiveLinkShell (Windows UDP Relay)
              </a>
              <a
                href="downloads/UnityLiveLink.unitypackage"
                download
                className="vs-btn vs-btn-secondary"
                style={{ textAlign: 'center', padding: '8px 12px', fontSize: '12.5px', textDecoration: 'none' }}
              >
                ↓ Unity Live Capture Package
              </a>
              <button
                type="button"
                onClick={onOpenHelp}
                className="vs-btn vs-btn-ghost"
                style={{ fontSize: '12px', padding: '6px', color: '#c084fc' }}
              >
                📖 Open Setup Guide & Instructions
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 5: Settings                                                    */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Mocap Pipeline & Telemetry
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Temporal filter smoothing, CSV recording, and diagnostic tools.
              </p>
            </div>

            {/* Temporal Smoother Slider */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                  Tracking Smoother
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#a78bfa' }}>
                  {store.smoothStep.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                className="vs-range"
                min={0.5}
                max={1.0}
                step={0.005}
                value={store.smoothStep}
                onChange={e => { store.smoothStep = parseFloat(e.target.value); }}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.4)' }}>
                <span>0.50 (Responsive)</span>
                <span>1.00 (Max Smooth)</span>
              </div>
            </div>

            {/* CSV Recorder Panel */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                CSV Motion Capture Recording
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.4 }}>
                Records all 52 blendshape channels at 60 FPS and downloads <code style={{ color: '#c084fc' }}>BlendshapeData.csv</code> upon completion.
              </div>
              <button
                type="button"
                className={`vs-btn ${store.recording ? 'vs-btn-danger' : 'vs-btn-primary'}`}
                style={{ padding: '9px', fontSize: '13px', fontWeight: 600, borderRadius: '8px' }}
                onClick={handleRecordToggle}
                disabled={!store.tracking}
              >
                {store.recording ? '⏹ Stop Recording & Download CSV' : '🔴 Start CSV Recording'}
              </button>
            </div>

            {/* Pipeline Diagnostics */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>MediaPipe Vision Task:</span>
                <span style={{ color: store.loaded ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>
                  {store.loaded ? 'Active' : 'Initializing'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Running Mode:</span>
                <span style={{ color: '#fff' }}>{store.runningMode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tracking Delegate:</span>
                <span style={{ color: '#fff' }}>GPU / WebGL</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </GlassInspectorDrawer>
  );
});

export default MocapInspector;
