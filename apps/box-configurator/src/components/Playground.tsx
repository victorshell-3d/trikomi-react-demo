import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Shape } from 'react-konva';

import { getRectSegments, clipSegmentAgainstRect, reconstructLoops, forceClockwise, offsetLoop } from '@trikomi/core/box';

interface PlaygroundProps {
  onBack: () => void;
}

export const Playground: React.FC<PlaygroundProps> = ({ onBack }) => {
  const [scale, setScale] = useState(1.2);
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Square positions
  const [square1Pos, setSquare1Pos] = useState({ x: 150, y: 150 });
  const [square2Pos, setSquare2Pos] = useState({ x: 250, y: 150 });
  const [isMerged, setIsMerged] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = (e: Event) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(newScale);
    setPos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const resetSquares = () => {
    setSquare1Pos({ x: 150, y: 150 });
    setSquare2Pos({ x: 250, y: 150 });
    setScale(1.2);
    setPos({ x: 100, y: 100 });
    setIsMerged(false);
  };

  const r1 = { x: square1Pos.x, y: square1Pos.y, w: 100, h: 100 };
  const r2 = { x: square2Pos.x, y: square2Pos.y, w: 100, h: 100 };

  const segments1 = getRectSegments(r1);
  const segments2 = getRectSegments(r2);

  const finalLines: number[][] = [];

  segments1.forEach(seg => {
    finalLines.push(...clipSegmentAgainstRect(seg, r2));
  });

  segments2.forEach(seg => {
    finalLines.push(...clipSegmentAgainstRect(seg, r1));
  });

  const loops = reconstructLoops(finalLines);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#0a0b0d', color: 'white', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', background: '#111827', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Trikomi Box Configurator</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#9ca3af' }}>Parametric packaging designer with 2D dieline editor</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={resetSquares}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#d1d5db',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              outline: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Reset Layout
          </button>
          <button 
            onClick={onBack}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid #6366f1',
              color: '#a5b4fc',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'; e.currentTarget.style.color = '#a5b4fc'; }}
          >
            ← Back to Configurator
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        {/* Sidebar Info */}
        <div style={{ width: '280px', background: '#111827', borderRight: '1px solid #1f2937', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#818cf8' }}>Coordinates</h3>
          <div style={{ background: '#1f2937', padding: '12px', borderRadius: '8px', border: '1px solid #374151' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 'bold' }}>Square 1 (Blue)</div>
            <div style={{ fontSize: '0.85rem', marginTop: '4px', fontFamily: 'monospace' }}>X: {Math.round(square1Pos.x)}px</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>Y: {Math.round(square1Pos.y)}px</div>
          </div>
          <div style={{ background: '#1f2937', padding: '12px', borderRadius: '8px', border: '1px solid #374151' }}>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 'bold' }}>Square 2 (Green)</div>
            <div style={{ fontSize: '0.85rem', marginTop: '4px', fontFamily: 'monospace' }}>X: {Math.round(square2Pos.x)}px</div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>Y: {Math.round(square2Pos.y)}px</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: '1.4', marginTop: '10px' }}>
            <strong>Note:</strong> By default, they are rendered exactly adjacent (Square 1 at 150, 150; Square 2 at 250, 150) with width 100px. Drag them to test overlap, canvas scaling, or rendering precision.
          </div>

          <h3 style={{ margin: '10px 0 0 0', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#818cf8' }}>Boolean Operations</h3>
          <button 
            onClick={() => setIsMerged(!isMerged)}
            style={{
              background: isMerged ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)',
              border: '1px solid ' + (isMerged ? '#10b981' : '#6366f1'),
              color: isMerged ? '#34d399' : '#a5b4fc',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              outline: 'none',
              width: '100%',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isMerged ? '#10b981' : '#6366f1';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isMerged ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)';
              e.currentTarget.style.color = isMerged ? '#34d399' : '#a5b4fc';
            }}
          >
            {isMerged ? 'Split Squares' : 'Merge Squares'}
          </button>
        </div>

        {/* Canvas Wrapper */}
        <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#111318' }}>
          {dimensions.width > 0 && dimensions.height > 0 && (
            <Stage
              width={dimensions.width}
              height={dimensions.height}
              scaleX={scale}
              scaleY={scale}
              x={pos.x}
              y={pos.y}
              onWheel={handleWheel}
              draggable
              onDragEnd={(e) => {
                if (e.target === e.target.getStage()) {
                  setPos({ x: e.target.x(), y: e.target.y() });
                }
              }}
            >
              <Layer>
                {/* Instructions */}
                <Text 
                  text="🖱️ Scroll to zoom | ✋ Drag canvas to pan | 📦 Drag squares to move" 
                  x={20} 
                  y={20} 
                  fill="#6b7280" 
                  fontSize={12} 
                  fontFamily="sans-serif"
                />
                
                {!isMerged ? (
                  <>
                    {/* Square 1 */}
                    <Rect
                      x={square1Pos.x}
                      y={square1Pos.y}
                      width={100}
                      height={100}
                      fill="rgba(79, 70, 229, 0.85)"
                      stroke="#818cf8"
                      strokeWidth={2}
                      draggable
                      onDragMove={(e) => {
                        setSquare1Pos({ x: e.target.x(), y: e.target.y() });
                      }}
                      onMouseEnter={(e) => {
                        const container = e.target.getStage()?.container();
                        if (container) container.style.cursor = 'move';
                      }}
                      onMouseLeave={(e) => {
                        const container = e.target.getStage()?.container();
                        if (container) container.style.cursor = 'default';
                      }}
                    />

                    {/* Square 2 */}
                    <Rect
                      x={square2Pos.x}
                      y={square2Pos.y}
                      width={100}
                      height={100}
                      fill="rgba(16, 185, 129, 0.85)"
                      stroke="#34d399"
                      strokeWidth={2}
                      draggable
                      onDragMove={(e) => {
                        setSquare2Pos({ x: e.target.x(), y: e.target.y() });
                      }}
                      onMouseEnter={(e) => {
                        const container = e.target.getStage()?.container();
                        if (container) container.style.cursor = 'move';
                      }}
                      onMouseLeave={(e) => {
                        const container = e.target.getStage()?.container();
                        if (container) container.style.cursor = 'default';
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* Merged Shape (single unified entity) */}
                    <Shape
                      fill="rgba(79, 70, 229, 0.85)"
                      stroke="#22c55e"
                      strokeWidth={3}
                      draggable
                      onDragEnd={(e) => {
                        const dx = e.target.x();
                        const dy = e.target.y();
                        setSquare1Pos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                        setSquare2Pos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                        e.target.x(0);
                        e.target.y(0);
                        e.target.getLayer()?.batchDraw();
                      }}
                      onMouseEnter={(e) => {
                        const container = e.target.getStage()?.container();
                        if (container) container.style.cursor = 'move';
                      }}
                      onMouseLeave={(e) => {
                        const container = e.target.getStage()?.container();
                        if (container) container.style.cursor = 'default';
                      }}
                      sceneFunc={(ctx, shape) => {
                        ctx.beginPath();
                        loops.forEach(loop => {
                          if (loop.length > 0) {
                            ctx.moveTo(loop[0][0], loop[0][1]);
                            for (let i = 1; i < loop.length; i++) {
                              ctx.lineTo(loop[i][0], loop[i][1]);
                            }
                            ctx.closePath();
                          }
                        });
                        ctx.fillStrokeShape(shape);
                      }}
                    />

                    {/* Bleed line (dotted green line offset outwards) */}
                    <Shape
                      stroke="#22c55e"
                      strokeWidth={2}
                      dash={[5, 5]}
                      listening={false}
                      sceneFunc={(ctx, shape) => {
                        ctx.beginPath();
                        loops.forEach(loop => {
                          if (loop.length > 0) {
                            const cwLoop = forceClockwise(loop);
                            const offsetL = offsetLoop(cwLoop, 8); // 8px bleed offset
                            ctx.moveTo(offsetL[0][0], offsetL[0][1]);
                            for (let i = 1; i < offsetL.length; i++) {
                              ctx.lineTo(offsetL[i][0], offsetL[i][1]);
                            }
                            ctx.closePath();
                          }
                        });
                        ctx.fillStrokeShape(shape);
                      }}
                    />
                  </>
                )}
              </Layer>
            </Stage>
          )}
        </div>
      </div>
    </div>
  );
};
