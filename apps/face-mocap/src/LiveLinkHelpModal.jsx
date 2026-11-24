import React from 'react';
import { FrostedModalDialog } from '@trikomi/ui-kit';

export const LiveLinkHelpModal = ({ isOpen, onClose }) => {
  return (
    <FrostedModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="LiveLink Streaming Guide"
      subtitle="Connect Trikomi Face Mocap to Unreal Engine MetaHumans and Unity Live Capture"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button
            type="button"
            onClick={onClose}
            className="vs-btn vs-btn-primary"
            style={{
              padding: '8px 22px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#e2e8f0', fontSize: '13.5px', lineHeight: 1.6 }}>
        {/* Unreal Engine Section */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#c084fc', fontWeight: 700, fontSize: '15px' }}>
            <span>🎮</span>
            <span>Unreal Engine 5 (MetaHuman / LiveLink)</span>
          </div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Download and unzip <strong style={{ color: '#fff' }}>LiveLinkShell (Windows)</strong> from the LiveLink tab.</li>
            <li>Run <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#a78bfa' }}>LiveLinkShell.exe</code> to start the local UDP relay bridge on port <strong>11111</strong>.</li>
            <li>In Unreal Engine, enable the <strong style={{ color: '#fff' }}>Live Link</strong> plugin and add a <strong>Live Link Subject</strong> named <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#a78bfa' }}>Face</code>.</li>
            <li>Assign the Subject to your MetaHuman or Skeletal Mesh Live Link component.</li>
          </ol>
        </div>

        {/* Unity Section */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#818cf8', fontWeight: 700, fontSize: '15px' }}>
            <span>🕹️</span>
            <span>Unity Live Capture & Animation</span>
          </div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Download <strong style={{ color: '#fff' }}>UnityLiveLink.unitypackage</strong> from the LiveLink tab.</li>
            <li>In Unity, go to <strong>Assets → Import Package → Custom Package</strong> and select the downloaded package.</li>
            <li>Attach the <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#a78bfa' }}>TrikomiLiveLinkReceiver</code> script to your target rigged character.</li>
            <li>Ensure the WebSocket server address matches your local host (default: <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#a78bfa' }}>127.0.0.1:5000</code>).</li>
          </ol>
        </div>

        {/* 52 ARKit Blendshapes Protocol */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#f472b6', fontWeight: 700, fontSize: '15px' }}>
            <span>📡</span>
            <span>Broadcast Protocol Specifications</span>
          </div>
          <p style={{ margin: 0 }}>
            Trikomi streams standard Apple ARKit-compatible blendshape curves across 52 individual facial channels, plus head rotation pitch/yaw/roll quaternions. Packets are streamed continuously over WebSocket/UDP at the engine render frequency.
          </p>
        </div>
      </div>
    </FrostedModalDialog>
  );
};

export default LiveLinkHelpModal;
