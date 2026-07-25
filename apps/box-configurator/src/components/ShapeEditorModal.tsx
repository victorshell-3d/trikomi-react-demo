import React, { useRef, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Stage, Layer, Path, Circle, Line, Group, Text, Rect } from 'react-konva';
import { generateSVGPath, PathCommand, distToSegment, getBezierPoint, splitBezier, getClosestTOnBezier, convertLineToBezier } from '@trikomi/core/box';
import { configStore } from '../store/ConfigStore';

const SCALE = 350; // pixels to render the 1x1 relative coordinate space

export const ShapeEditorModal = observer(() => {
  const templateId = configStore.editingTemplateId;
  const template = templateId ? configStore.templates[templateId] : null;

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Record<string, unknown>>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current as any;
    if (!stage) return;
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

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut for deleting node
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPointIndex !== null && selectedPointIndex > 0) {
        handleDeletePoint(selectedPointIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPointIndex, template]);

  if (!template) return null;

  // Center the drawing in the canvas area
  const offsetX = dimensions.width / 2;
  const offsetY = dimensions.height / 2;

  // Coordinate conversion helpers
  const toPixelX = (x: number) => x * SCALE;
  const toPixelY = (y: number) => y * SCALE;
  const toRelX = (px: number) => px / SCALE;
  const toRelY = (py: number) => py / SCALE;

  // Clamping coordinates
  const clampRelX = (x: number) => Math.max(-1, Math.min(1, x));
  const clampRelY = (y: number) => Math.max(-1, Math.min(2, y));

  const isHole = template.id.startsWith('temp-hole-');
  
  // Flaps also need to be visually closed so they fill correctly, 
  // their start and end point define the attachment base.
  let svgData = generateSVGPath(template.path, SCALE, SCALE);
  svgData += ' Z';


  // Click on path to add a point (supports curves and lines)
  const handlePathClick = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const transform = e.target.getLayer().getAbsoluteTransform().copy().invert();
    const localPos = transform.point(pointer);
    
    const clickX = toRelX(localPos.x);
    const clickY = toRelY(localPos.y);

    let minDistance = Infinity;
    let insertIndex = -1;
    let bestT = 0.5;

    // Loop through each segment to find the closest one
    for (let i = 1; i < template.path.length; i++) {
      const prev = template.path[i - 1];
      const curr = template.path[i];
      
      if (curr.type === 'C') {
        const result = getClosestTOnBezier(clickX, clickY, { x: prev.x, y: prev.y }, { x: curr.cp1x!, y: curr.cp1y! }, { x: curr.cp2x!, y: curr.cp2y! }, { x: curr.x, y: curr.y }, 16);
        if (result.dist < minDistance) {
          minDistance = result.dist;
          insertIndex = i;
          bestT = result.t;
        }
      } else {
        // Line segment distance
        const dist = distToSegment(clickX, clickY, prev.x, prev.y, curr.x, curr.y);
        if (dist < minDistance) {
          minDistance = dist;
          insertIndex = i;
          bestT = 0.5;
        }
      }
    }

    // Hits target check (approx 18 pixels threshold)
    if (insertIndex !== -1 && minDistance < 0.05) {
      const prev = template.path[insertIndex - 1];
      const curr = template.path[insertIndex];
      const newPath = [...template.path];

      if (curr.type === 'C') {
        const p0 = { x: prev.x, y: prev.y };
        const p1 = { x: curr.cp1x!, y: curr.cp1y! };
        const p2 = { x: curr.cp2x!, y: curr.cp2y! };
        const p3 = { x: curr.x, y: curr.y };

        const split = splitBezier(bestT, p0, p1, p2, p3);

        newPath.splice(insertIndex, 1, split.cmd1, split.cmd2);
      } else {
        // Split Line segment
        const newCmd: PathCommand = {
          type: 'L',
          x: clickX,
          y: clickY
        };
        newPath.splice(insertIndex, 0, newCmd);
      }

      configStore.setTemplatePath(template.id, newPath);
      setSelectedPointIndex(insertIndex);
    }
  };

  // Delete point
  const handleDeletePoint = (index: number) => {
    if (template.path.length <= 2) return;
    configStore.deleteTemplatePathCommand(template.id, index);
    setSelectedPointIndex(Math.max(0, index - 1));
  };

  // Convert command to Bezier Curve (C)
  const handleConvertToBezier = (index: number) => {
    if (index === 0) return;
    const currentPath = template.path;
    const curr = currentPath[index];
    const prev = currentPath[index - 1];

    const cps = convertLineToBezier({ x: prev.x, y: prev.y }, { x: curr.x, y: curr.y });

    configStore.updateTemplatePathCommand(template.id, index, {
      type: 'C',
      x: curr.x,
      y: curr.y,
      cp1x: cps.cp1x,
      cp1y: cps.cp1y,
      cp2x: cps.cp2x,
      cp2y: cps.cp2y
    });
  };

  // Convert command to Line (L)
  const handleConvertToLine = (index: number) => {
    if (index === 0) return;
    const curr = template.path[index];
    configStore.updateTemplatePathCommand(template.id, index, {
      type: 'L',
      x: curr.x,
      y: curr.y
    });
  };

  // Double click toggles corner / smooth curve
  const handleAnchorDblClick = (index: number) => {
    if (index === 0) return;
    const cmd = template.path[index];
    if (cmd.type === 'C') {
      handleConvertToLine(index);
    } else {
      handleConvertToBezier(index);
    }
  };

  // Update coordinate value manually
  const handleCoordChange = (index: number, field: keyof PathCommand, value: number) => {
    if (!Number.isFinite(value)) return;
    const cmd = template.path[index];
    const updated = {
      ...cmd,
      [field]: field === 'x' || field === 'cp1x' || field === 'cp2x' ? clampRelX(value) : clampRelY(value)
    } as PathCommand;
    configStore.updateTemplatePathCommand(template.id, index, updated);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(10, 12, 16, 0.95)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px', backgroundColor: '#161920', borderBottom: '1px solid #2d3748',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1001
      }}>
        <div>
          <h2 style={{ margin: 0, color: 'white', fontSize: '1.25rem', fontWeight: 600 }}>Vector Shape Editor</h2>
          <div style={{ fontSize: '0.85rem', color: '#a0aec0', marginTop: '4px' }}>
            Modify custom templates for <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{template.name}</span>
          </div>
        </div>
        <button 
          onClick={() => configStore.setEditingTemplateId(null)}
          style={{ 
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', 
            color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', 
            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          Done
        </button>
      </div>

      {/* Main Workspace (Full-screen Canvas) */}
      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#0d0f14' }}>
        
        {/* Floating Shortcuts / Instructions */}
        <div style={{
          position: 'absolute', bottom: '20px', left: '20px',
          backgroundColor: 'rgba(22, 25, 32, 0.85)', zIndex: 100,
          border: '1px solid #2d3748', borderRadius: '8px', padding: '12px 16px',
          color: '#cbd5e0', fontSize: '0.8rem', lineHeight: '1.6',
          pointerEvents: 'none', maxWidth: '340px', backdropFilter: 'blur(6px)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#818cf8', borderRadius: '50%' }} />
            Illustrator Vector Shortcuts:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>• <span style={{ color: '#818cf8', fontWeight: 500 }}>Click on the stroke</span> to insert a new point</div>
            <div>• <span style={{ color: '#818cf8', fontWeight: 500 }}>Drag handles or anchor points</span> to adjust geometry</div>
            <div>• <span style={{ color: '#818cf8', fontWeight: 500 }}>Double-click any anchor point</span> to toggle Curve/Corner</div>
            <div>• <span style={{ color: '#818cf8', fontWeight: 500 }}>Backspace / Delete key</span> to remove selected point</div>
          </div>
        </div>

        {/* Floating Node Properties Bar */}
        {selectedPointIndex !== null && template.path[selectedPointIndex] && (
          <div style={{
            position: 'absolute', top: '20px', right: '20px',
            backgroundColor: 'rgba(22, 25, 32, 0.85)', zIndex: 100,
            border: '1px solid #2d3748', borderRadius: '8px', padding: '16px',
            color: '#e2e8f0', fontSize: '0.8rem', backdropFilter: 'blur(6px)',
            display: 'flex', flexDirection: 'column', gap: '10px', width: '220px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d3748', paddingBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', color: 'white' }}>Node {selectedPointIndex + 1} Properties</span>
              {selectedPointIndex > 0 && template.path.length > 2 && (isHole || selectedPointIndex !== template.path.length - 1) && (
                <button 
                  onClick={() => handleDeletePoint(selectedPointIndex)}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  Delete
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: '#a0aec0', width: '15px' }}>X:</span>
              <input
                type="number"
                step="0.01"
                disabled={!isHole && (selectedPointIndex === 0 || selectedPointIndex === 1 || selectedPointIndex === template.path.length - 1)}
                value={Math.round(template.path[selectedPointIndex].x * 100) / 100}
                onChange={(e) => handleCoordChange(selectedPointIndex, 'x', parseFloat(e.target.value))}
                style={{
                  width: '100%', background: '#13161c', border: '1px solid #4a5568', borderRadius: '4px',
                  color: 'white', padding: '4px 6px', fontSize: '0.75rem', opacity: (!isHole && (selectedPointIndex === 0 || selectedPointIndex === 1 || selectedPointIndex === template.path.length - 1)) ? 0.5 : 1
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: '#a0aec0', width: '15px' }}>Y:</span>
              <input
                type="number"
                step="0.01"
                disabled={!isHole && (selectedPointIndex === 0 || selectedPointIndex === 1 || selectedPointIndex === template.path.length - 1)}
                value={Math.round(template.path[selectedPointIndex].y * 100) / 100}
                onChange={(e) => handleCoordChange(selectedPointIndex, 'y', parseFloat(e.target.value))}
                style={{
                  width: '100%', background: '#13161c', border: '1px solid #4a5568', borderRadius: '4px',
                  color: 'white', padding: '4px 6px', fontSize: '0.75rem', opacity: (!isHole && (selectedPointIndex === 0 || selectedPointIndex === 1 || selectedPointIndex === template.path.length - 1)) ? 0.5 : 1
                }}
              />
            </div>
            
            {selectedPointIndex > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={() => handleConvertToLine(selectedPointIndex)}
                  style={{
                    flex: 1, padding: '4px', fontSize: '0.7rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
                    backgroundColor: template.path[selectedPointIndex].type === 'L' ? '#4f46e5' : '#2d3748',
                    color: template.path[selectedPointIndex].type === 'L' ? 'white' : '#a0aec0'
                  }}
                >
                  Corner
                </button>
                <button
                  onClick={() => handleConvertToBezier(selectedPointIndex)}
                  style={{
                    flex: 1, padding: '4px', fontSize: '0.7rem', borderRadius: '4px', border: 'none', cursor: 'pointer',
                    backgroundColor: template.path[selectedPointIndex].type === 'C' ? '#4f46e5' : '#2d3748',
                    color: template.path[selectedPointIndex].type === 'C' ? 'white' : '#a0aec0'
                  }}
                >
                  Curve
                </button>
              </div>
            )}
          </div>
        )}

        <Stage 
          width={dimensions.width} 
          height={dimensions.height}
          ref={stageRef}
          scaleX={scale}
          scaleY={scale}
          x={pos.x}
          y={pos.y}
          draggable
          onClick={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedPointIndex(null);
          }}
          onTap={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedPointIndex(null);
          }}
          onWheel={handleWheel}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setPos({ x: e.target.x(), y: e.target.y() });
            }
          }}
        >
          <Layer x={offsetX} y={isHole ? offsetY : offsetY - SCALE / 2}>
            
            {/* Stage Grid Background for clicking target */}
            <Rect 
              x={-dimensions.width / 2} 
              y={-offsetY} 
              width={dimensions.width} 
              height={dimensions.height}
              fill="transparent"
            />

            {/* Reference Grid & Bounding Box */}
            {isHole ? (
              <Path 
                data={`M ${-0.5 * SCALE} ${-0.5 * SCALE} L ${0.5 * SCALE} ${-0.5 * SCALE} L ${0.5 * SCALE} ${0.5 * SCALE} L ${-0.5 * SCALE} ${0.5 * SCALE} Z`}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1.5}
                dash={[6, 6]}
              />
            ) : (
              <Path 
                data={`M ${-0.5 * SCALE} 0 L ${0.5 * SCALE} 0 L ${0.5 * SCALE} ${SCALE} L ${-0.5 * SCALE} ${SCALE} Z`}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1.5}
                dash={[6, 6]}
              />
            )}
            
            {/* Axes Ticks */}
            {isHole ? (
              <>
                <Line points={[0, -SCALE * 0.7, 0, SCALE * 0.7]} stroke="rgba(255, 255, 255, 0.06)" strokeWidth={1} />
                <Line points={[-SCALE * 0.7, 0, SCALE * 0.7, 0]} stroke="rgba(255, 255, 255, 0.06)" strokeWidth={1} />
                <Circle x={0} y={0} radius={4} fill="#f87171" opacity={0.8} />
              </>
            ) : (
              <>
                <Line points={[0, -40, 0, SCALE + 40]} stroke="rgba(255, 255, 255, 0.04)" strokeWidth={1} />
                <Line points={[-SCALE * 0.7, 0, SCALE * 0.7, 0]} stroke="rgba(255, 255, 255, 0.04)" strokeWidth={1} />
              </>
            )}

            {/* The main vector shape stroke and fill */}
            <Path
              data={svgData}
              stroke="#6366f1"
              strokeWidth={4}
              fill="rgba(99, 102, 241, 0.06)"
              onClick={handlePathClick}
              onTap={handlePathClick}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                stage.container().style.cursor = 'crosshair';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                stage.container().style.cursor = 'default';
              }}
            />

            {/* Bezier connector guide lines */}
            {template.path.map((cmd, index) => {
              if (cmd.type !== 'C') return null;
              const prevCmd = index > 0 ? template.path[index - 1] : null;
              return (
                <Group key={`lines-${index}`}>
                  {prevCmd && (
                    <Line
                      points={[
                        toPixelX(prevCmd.x), toPixelY(prevCmd.y),
                        toPixelX(cmd.cp1x!), toPixelY(cmd.cp1y!)
                      ]}
                      stroke="#f87171"
                      strokeWidth={1.5}
                      dash={[3, 3]}
                      opacity={0.6}
                    />
                  )}
                  <Line
                    points={[
                      toPixelX(cmd.x), toPixelY(cmd.y),
                      toPixelX(cmd.cp2x!), toPixelY(cmd.cp2y!)
                    ]}
                    stroke="#f87171"
                    strokeWidth={1.5}
                    dash={[3, 3]}
                    opacity={0.6}
                  />
                </Group>
              );
            })}

            {/* Anchor Points and Handles */}
            {template.path.map((cmd, index) => {
              const isSelected = selectedPointIndex === index;
              
              return (
                <Group key={`handles-${index}`}>
                  {/* Bezier Handles CP1 and CP2 */}
                  {cmd.type === 'C' && (
                    <>
                      {/* CP1 Handle */}
                      <Circle
                        x={toPixelX(cmd.cp1x!)}
                        y={toPixelY(cmd.cp1y!)}
                        radius={6}
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        draggable
                        onDragStart={(e) => {
                          e.cancelBubble = true;
                          setSelectedPointIndex(index);
                        }}
                        onDragMove={(e) => {
                          configStore.updateTemplatePathCommand(template.id, index, {
                            ...cmd,
                            cp1x: clampRelX(toRelX(e.target.x())),
                            cp1y: clampRelY(toRelY(e.target.y()))
                          });
                        }}
                        onMouseEnter={(e) => {
                          const stage = e.target.getStage();
                          stage.container().style.cursor = 'pointer';
                        }}
                        onMouseLeave={(e) => {
                          const stage = e.target.getStage();
                          stage.container().style.cursor = 'default';
                        }}
                      />
                      {/* CP2 Handle */}
                      <Circle
                        x={toPixelX(cmd.cp2x!)}
                        y={toPixelY(cmd.cp2y!)}
                        radius={6}
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        draggable
                        onDragStart={(e) => {
                          e.cancelBubble = true;
                          setSelectedPointIndex(index);
                        }}
                        onDragMove={(e) => {
                          configStore.updateTemplatePathCommand(template.id, index, {
                            ...cmd,
                            cp2x: clampRelX(toRelX(e.target.x())),
                            cp2y: clampRelY(toRelY(e.target.y()))
                          });
                        }}
                        onMouseEnter={(e) => {
                          const stage = e.target.getStage();
                          stage.container().style.cursor = 'pointer';
                        }}
                        onMouseLeave={(e) => {
                          const stage = e.target.getStage();
                          stage.container().style.cursor = 'default';
                        }}
                      />
                    </>
                  )}

                  {/* Main Anchor Point Handle */}
                  <Circle
                    x={toPixelX(cmd.x)}
                    y={toPixelY(cmd.y)}
                    radius={isSelected ? 9 : 7}
                    fill={(!isHole && (index === 0 || index === 1 || index === template.path.length - 1)) ? "#475569" : (isSelected ? "#818cf8" : "#4f46e5")}
                    stroke="white"
                    strokeWidth={2}
                    draggable={isHole || (index !== 0 && index !== 1 && index !== template.path.length - 1)}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      setSelectedPointIndex(index);
                    }}
                    onTap={(e) => {
                      e.cancelBubble = true;
                      setSelectedPointIndex(index);
                    }}
                    onDblClick={(e) => {
                      e.cancelBubble = true;
                      if (!isHole && (index === 0 || index === 1 || index === template.path.length - 1)) return;
                      handleAnchorDblClick(index);
                    }}
                    onDblTap={(e) => {
                      e.cancelBubble = true;
                      if (!isHole && (index === 0 || index === 1 || index === template.path.length - 1)) return;
                      handleAnchorDblClick(index);
                    }}
                    onDragStart={() => setSelectedPointIndex(index)}
                    onDragMove={(e) => {
                      const updated = {
                        ...cmd,
                        x: clampRelX(toRelX(e.target.x())),
                        y: clampRelY(toRelY(e.target.y()))
                      };
                      configStore.updateTemplatePathCommand(template.id, index, updated);
                    }}
                    onMouseEnter={(e) => {
                      if (!isHole && (index === 0 || index === 1 || index === template.path.length - 1)) {
                        e.target.getStage().container().style.cursor = 'not-allowed';
                      } else {
                        e.target.getStage().container().style.cursor = 'move';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.getStage().container().style.cursor = 'default';
                    }}
                  />

                  {/* Node label */}
                  <Text
                    x={toPixelX(cmd.x) + 12}
                    y={toPixelY(cmd.y) - 16}
                    text={`P${index + 1}`}
                    fontSize={11}
                    fill={(!isHole && (index === 0 || index === 1 || index === template.path.length - 1)) ? "#475569" : (isSelected ? "#818cf8" : "#a0aec0")}
                    fontStyle="bold"
                  />
                </Group>
              );
            })}

          </Layer>
        </Stage>
      </div>
    </div>
  );
});
