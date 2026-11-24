import React from 'react';
import { FrostedModalDialog } from '@trikomi/ui-kit';

export const WebARHelpModal = ({ isOpen, onClose }) => {
  return (
    <FrostedModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="WebAR Try-On Guide"
      subtitle="Niantic 8thWall Face Tracking & Camera Guidelines"
      size="md"
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
            Got It
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#e2e8f0', fontSize: '13px', lineHeight: 1.6 }}>
        {/* Camera Permission Section */}
        <div style={{
          padding: '14px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#f472b6', fontWeight: 700, fontSize: '14px' }}>
            <span>📷</span>
            <span>Camera Permissions</span>
          </div>
          <p style={{ margin: 0 }}>
            WebAR requires standard camera access. When prompted by your mobile browser (Safari on iOS or Chrome on Android), tap <strong style={{ color: '#fff' }}>Allow</strong>. Secure HTTPS context is mandatory.
          </p>
        </div>

        {/* Optimal Lighting */}
        <div style={{
          padding: '14px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#c084fc', fontWeight: 700, fontSize: '14px' }}>
            <span>💡</span>
            <span>Lighting & Calibration</span>
          </div>
          <p style={{ margin: 0 }}>
            Ensure your face is evenly illuminated with front lighting. Avoid intense backlighting or direct sun behind your head, which can impede facial anchor depth detection.
          </p>
        </div>

        {/* Head Positioning */}
        <div style={{
          padding: '14px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#818cf8', fontWeight: 700, fontSize: '14px' }}>
            <span>📐</span>
            <span>Viewing Distance</span>
          </div>
          <p style={{ margin: 0 }}>
            Hold your mobile device 12–18 inches (30–45 cm) from your face. The 8thWall SLAM tracking automatically scales and seats the 3D eyewear onto your nose bridge and ears.
          </p>
        </div>
      </div>
    </FrostedModalDialog>
  );
};

export default WebARHelpModal;
