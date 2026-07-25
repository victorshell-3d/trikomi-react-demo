import React from 'react';
import { observer } from 'mobx-react-lite';
import { useConfigStore } from '../store/ConfiguratorStore';
import './OrderFormModal.css';

export const OrderFormModal: React.FC = observer(() => {
  const configStore = useConfigStore();
  if (!configStore.showOrderForm) return null;

  const generateAndDownloadPDF = () => {
    if (window.kendo && window.kendo.drawing) {
      window.kendo.drawing
        .drawDOM("#TechPackExport", {
          scale: 1,
          height: "297mm",
          width: "210mm",
        })
        .then(function(group: Record<string, unknown> | string | number | boolean) {
          window.kendo.drawing.pdf.toBlob(group, (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Sinalli_Tech_Pack.pdf';
            a.click();
          });
        });
    } else {
      console.error("Kendo not loaded. Make sure kendo.all.min.js is in index.html");
    }
  };

  return (
    <div className="order-form-overlay">
      <div className="order-form-modal">
        <div className="order-form-header">
          <div>
            <h2>Tech Pack / Order Form</h2>
            <p className="subtitle">Sportswear Configurator Details</p>
          </div>
          <div className="header-actions">
            <button className="btn-print" onClick={generateAndDownloadPDF}>Download PDF</button>
            <button className="btn-close" onClick={() => configStore.setShowOrderForm(false)}>✕</button>
          </div>
        </div>

        <div className="order-form-content">
          <div id="TechPackExport" className="tech-pack-a4">
            
            {/* Header */}
            <div className="tp-header">
              <div className="tp-brand">
                <div className="tp-logo-placeholder">Trikomi</div>
                <h1>TECH PACK / ORDER FORM</h1>
              </div>
              <div className="tp-meta">
                <div className="tp-meta-item">
                  <span className="tp-meta-label">Date Generated</span>
                  <span className="tp-meta-value">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="tp-meta-item">
                  <span className="tp-meta-label">Garment Type</span>
                  <span className="tp-meta-value">Sportswear (Custom)</span>
                </div>
              </div>
            </div>

            {/* Renders */}
            <div className="tp-section">
              <h3 className="tp-section-title">3D Visualizations</h3>
              <div className="tp-renders-grid">
                {configStore.orderScreenshots.map((src, i) => (
                  <div key={i} className="tp-render-item">
                    <img src={src} alt={`View ${i}`} />
                    <span className="tp-render-label">{['FRONT', 'BACK', 'LEFT', 'RIGHT'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications & Colors */}
            <div className="tp-row">
              <div className="tp-section" style={{ flex: 1 }}>
                <h3 className="tp-section-title">Material Spec</h3>
                <div className="tp-box">
                  <span className="tp-label">Fabric Type:</span>
                  <span className="tp-value">{configStore.fabricType.toUpperCase()}</span>
                </div>
              </div>

              <div className="tp-section" style={{ flex: 2 }}>
                <h3 className="tp-section-title">Color Breakdown</h3>
                <div className="tp-colors-grid">
                  {configStore.parts.map(part => (
                    <div key={part.id} className="tp-color-item">
                      <div className="tp-color-swatch" style={{ background: part.color }}></div>
                      <div className="tp-color-info">
                        <span className="tp-color-name">{part.name.toUpperCase()}</span>
                        <span className="tp-color-hex">{part.color}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Graphics */}
            <div className="tp-section">
              <h3 className="tp-section-title">Graphics & Typography</h3>
              <div className="tp-assets-list">
                {configStore.logos.length === 0 && configStore.texts.length === 0 && (
                  <p className="tp-empty">No graphics or text applied to this garment.</p>
                )}
                {configStore.logos.map(logo => (
                  <div key={logo.id} className="tp-asset-item">
                    <div className="tp-asset-thumb">
                      <img src={logo.src} alt="logo" />
                    </div>
                    <div className="tp-asset-details">
                      <strong>CUSTOM LOGO</strong>
                      <span>W: {Math.round(logo.width)}px &nbsp;|&nbsp; H: {Math.round(logo.height)}px &nbsp;|&nbsp; Rot: {Math.round(logo.rotation || 0)}°</span>
                    </div>
                  </div>
                ))}
                {configStore.texts.map(text => (
                  <div key={text.id} className="tp-asset-item">
                    <div className="tp-asset-thumb tp-text-thumb">
                      <span style={{ fontFamily: text.fontFamily, color: text.color }}>T</span>
                    </div>
                    <div className="tp-asset-details">
                      <strong>"{text.text}"</strong>
                      <span>Font: {text.fontFamily} &nbsp;|&nbsp; Color: {text.color} &nbsp;|&nbsp; Size: {Math.round(text.fontSize)}px</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});
