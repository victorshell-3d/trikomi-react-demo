import React from 'react';
import { observer } from 'mobx-react-lite';
import { useConfigStore } from '../store/ConfiguratorStore';

export const Sidebar: React.FC = observer(() => {
  const configStore = useConfigStore();
  return (
    <>
      <style>{`
        .sidebar {
          width: 280px;
          background: rgba(15, 15, 20, 0.7);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1);
          overflow-y: auto;
          color: #f8f9fa;
          font-family: 'Inter', system-ui, sans-serif;
          z-index: 10;
          pointer-events: auto;
        }
        
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }

        .title {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .section-title {
          margin: 20px 0 12px 0;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          color: #818cf8;
        }

        .card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 12px;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
        }
        .card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .color-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
        }
        
        .color-label {
          font-size: 12px;
          font-weight: 500;
          color: #cbd5e1;
        }

        .color-picker-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.3);
          padding: 4px 10px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          transition: border 0.2s;
        }
        .color-picker-wrap:hover {
          border-color: rgba(255,255,255,0.15);
        }

        .color-input {
          width: 18px;
          height: 18px;
          padding: 0;
          border: none;
          outline: none;
          border-radius: 50%;
          cursor: pointer;
          overflow: hidden;
          background: transparent;
          -webkit-appearance: none;
        }
        .color-input::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        .color-input::-webkit-color-swatch {
          border: none;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2) inset;
        }
        .color-input::-moz-color-swatch {
          border: none;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2) inset;
        }

        .hex-text {
          font-size: 10px;
          color: #94a3b8;
          font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
          text-transform: uppercase;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          text-align: center;
          display: block;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
        }

        .btn-remove {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-remove:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        }

        .text-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          width: 100%;
          font-size: 12px;
          outline: none;
          transition: border 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .text-input:focus {
          border-color: #818cf8;
          background: rgba(0,0,0,0.4);
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .item-title {
          font-size: 12px;
          font-weight: 600;
          color: #f1f5f9;
        }
      `}</style>

      <div className="sidebar">
        <h2 className="title">Customize</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
          <button 
            onClick={() => configStore.triggerViewChange('front')}
            className="btn-primary" 
            style={{ padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}
          >
            Front View
          </button>
          <button 
            onClick={() => configStore.triggerViewChange('back')}
            className="btn-primary" 
            style={{ padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}
          >
            Back View
          </button>
          <button 
            onClick={() => configStore.triggerViewChange('left')}
            className="btn-primary" 
            style={{ padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}
          >
            Left View
          </button>
          <button 
            onClick={() => configStore.triggerViewChange('right')}
            className="btn-primary" 
            style={{ padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}
          >
            Right View
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#8892b0', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>FABRIC MATERIAL</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button 
              onClick={() => configStore.setFabricType('mesh')}
              className="btn-primary" 
              style={{ padding: '8px', fontSize: '12px', background: configStore.fabricType === 'mesh' ? '#5865F2' : 'rgba(255,255,255,0.1)', boxShadow: 'none', transition: 'background 0.2s' }}
            >
              Mesh
            </button>
            <button 
              onClick={() => configStore.setFabricType('knit')}
              className="btn-primary" 
              style={{ padding: '8px', fontSize: '12px', background: configStore.fabricType === 'knit' ? '#5865F2' : 'rgba(255,255,255,0.1)', boxShadow: 'none', transition: 'background 0.2s' }}
            >
              Knit
            </button>
            <button 
              onClick={() => configStore.setFabricType('smooth')}
              className="btn-primary" 
              style={{ padding: '8px', fontSize: '12px', background: configStore.fabricType === 'smooth' ? '#5865F2' : 'rgba(255,255,255,0.1)', boxShadow: 'none', transition: 'background 0.2s' }}
            >
              Smooth
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {configStore.parts.map((part) => (
            <div key={part.id} className="color-row">
              <label className="color-label">{part.name}</label>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  value={part.color}
                  onChange={(e) => configStore.setPartColor(part.id, e.target.value)}
                  className="color-input"
                />
                <span className="hex-text">{part.color}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="section-title">Graphics</h3>

        <label className="btn-primary" style={{ marginBottom: '16px' }}>
          + Upload Logo
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                const targetX = configStore.centerUV ? configStore.centerUV.x * 2048 - 150 : 800;
                const targetY = configStore.centerUV ? configStore.centerUV.y * 2048 - 150 : 800;

                configStore.addLogo({
                  id: `logo-${Date.now()}`,
                  src: event.target?.result as string,
                  x: targetX,
                  y: targetY,
                  width: 300,
                  height: 300,
                  rotation: 0
                });
              };
              reader.readAsDataURL(file);
              e.target.value = '';
            }}
          />
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {configStore.logos.map((logo, index) => (
            <div key={logo.id} className="card">
              <div className="item-header" style={{ marginBottom: 0 }}>
                <span className="item-title">Logo {index + 1}</span>
                <button 
                  onClick={() => configStore.removeLogo(logo.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="section-title">Typography</h3>

        <button
          onClick={() => {
            const targetX = configStore.centerUV ? configStore.centerUV.x * 2048 : 950;
            const targetY = configStore.centerUV ? configStore.centerUV.y * 2048 : 800;

            configStore.addText({
              id: `text-${Date.now()}`,
              text: '10',
              fontFamily: 'Impact',
              color: '#ffffff',
              x: targetX, // We don't subtract width/2 here because text coordinates are already measured differently, or we can just drop it at centerUV precisely. Actually for text in TextureCompositor we translate to (x + width/2) so we should offset by width/2. Since default width is unknown here, we can leave it as center or roughly center. Let's just use exact projection coordinate, text is usually small.
              y: targetY,
              fontSize: 150,
              rotation: 0
            });
          }}
          className="btn-primary"
          style={{ marginBottom: '16px' }}
        >
          + Add Text
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {configStore.texts.map((textItem, index) => (
            <div key={textItem.id} className="card">
              <div className="item-header">
                <span className="item-title">Text {index + 1}</span>
                <button 
                  onClick={() => configStore.removeText(textItem.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="text" 
                  value={textItem.text} 
                  onChange={(e) => configStore.updateText(textItem.id, { text: e.target.value })}
                  className="text-input"
                  placeholder="Enter text..."
                />
                
                <div className="color-row" style={{ padding: 0 }}>
                  <label className="color-label">Color</label>
                  <div className="color-picker-wrap">
                    <input
                      type="color"
                      value={textItem.color}
                      onChange={(e) => configStore.updateText(textItem.id, { color: e.target.value })}
                      className="color-input"
                    />
                    <span className="hex-text">{textItem.color}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '32px', marginBottom: '8px' }}>
          <button 
            onClick={() => configStore.triggerGenerateScreenshots()}
            className="btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            Generate Order Form
          </button>
        </div>
      </div>
    </>
  );
});
