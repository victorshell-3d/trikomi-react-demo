import { drawUniversalHole, _PathAdapter, DESIGN_SCALE, _DESIGN_CENTER_X, _DESIGN_CENTER_Y, _DESIGN_WIDTH, _DESIGN_HEIGHT, getPatternCanvasCached, getClockwisePath } from '@trikomi/core/box';
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Transformer, Line, Text, Group, Circle, Image, Shape } from 'react-konva';
import { observer } from 'mobx-react-lite';
import { configStore } from '../store/ConfigStore';
import useImage from 'use-image';
import { FlapShapeRender } from './FlapShape';


const HoleShapeRender = observer(({ hole, factorX, h, scale }: Record<string, unknown> | string | number | boolean) => {
  // Access path to trigger reactivity
  const templatePath = hole.type === 'custom' && hole.shapeTemplateId
    ? configStore.templates[hole.shapeTemplateId]?.path
    : null;

  // Create a deep dependency so MobX re-renders this component when any point or property changes
  const holeDependency = JSON.stringify(hole);
  const pathDependency = templatePath ? JSON.stringify(templatePath) : '';
  const watchDependency = `${holeDependency}-${pathDependency}`;

  const cx = hole.x * factorX * scale;
  const cy = -h * scale / 2 - hole.y * scale;

  const drawShape = (ctx: Record<string, unknown> | string | number | boolean, bOffset: number = 0) => {
    ctx.beginPath();
    const adapter = {
      moveTo: (x: number, y: number) => ctx.moveTo(x, y),
      lineTo: (x: number, y: number) => ctx.lineTo(x, y),
      bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y),
      closePath: () => ctx.closePath()
    };
    drawUniversalHole(adapter, hole, cx, cy, scale, bOffset, factorX, false, false, configStore.templates);
  };

  return (
    <Group>
      {/* 1. Punch the hole (Erase) - full size, no bleed shrinkage.
           Bleed for holes is handled by clipBleed which clips design elements with a shrunk hole. */}
      <Shape
        _watch={watchDependency}
        fill="black"
        globalCompositeOperation="destination-out"
        sceneFunc={(ctx, shape) => {
          drawShape(ctx);
          ctx.fillStrokeShape(shape);
        }}
      />
      {/* 2. Draw a dashed red cut-line outline */}
      <Shape
        _watch={watchDependency}
        stroke="#ef4444"
        strokeWidth={1.5}
        dash={[4, 4]}
        listening={false}
        sceneFunc={(ctx, shape) => {
          drawShape(ctx);
          ctx.strokeShape(shape);
        }}
      />
      {/* 3. Draw a dashed green bleed outline (shrunk by 8 canvas units) */}
      <Shape
        _watch={watchDependency}
        stroke="#22c55e"
        strokeWidth={1}
        dash={[3, 3]}
        listening={false}
        sceneFunc={(ctx, shape) => {
          drawShape(ctx, 8);
          ctx.strokeShape(shape);
        }}
      />
    </Group>
  );
});

const DesignImage = ({ id, src, x, y, width, height, rotation, onSelect, onChange }: Record<string, unknown> | string | number | boolean) => {
  const [image] = useImage(src);

  return (
    <Image
      id={id}
      x={x}
      y={y}
      width={width || 100}
      height={height || 100}
      rotation={rotation || 0}
      image={image}
      onClick={onSelect}
      onTap={onSelect}
      draggable
      onDragMove={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransform={(e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: ((node.rotation() % 360) + 360) % 360
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: ((node.rotation() % 360) + 360) % 360
        });
      }}
    />
  );
};

const DesignText = ({ id, text, x, y, color, scale, rotation, fontSize, fontFamily, onSelect, onChange }: Record<string, unknown> | string | number | boolean) => {
  return (
    <Text
      id={id}
      text={text}
      x={x}
      y={y}
      fill={color || '#000000'}
      fontSize={fontSize || 24}
      fontFamily={fontFamily || 'sans-serif'}
      scaleX={scale}
      scaleY={scale}
      rotation={rotation}
      onClick={onSelect}
      onTap={onSelect}
      draggable
      onDragMove={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransform={(e) => {
        const node = e.target;
        onChange({
          x: node.x(),
          y: node.y(),
          scale: node.scaleX(),
          rotation: ((node.rotation() % 360) + 360) % 360
        });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        onChange({
          x: node.x(),
          y: node.y(),
          scale: node.scaleX(),
          rotation: ((node.rotation() % 360) + 360) % 360
        });
      }}
    />
  );
};

const HorizontalMeasure = ({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) => {
  const midX = (x1 + x2) / 2;
  const strokeColor = '#818cf8';
  return (
    <Group>
      <Line points={[x1, y, x2, y]} stroke={strokeColor} strokeWidth={1} dash={[4, 4]} />
      <Line points={[x1, y - 5, x1, y + 5]} stroke={strokeColor} strokeWidth={1.5} />
      <Line points={[x2, y - 5, x2, y + 5]} stroke={strokeColor} strokeWidth={1.5} />
      <Group x={midX} y={y}>
        <Rect
          x={-20}
          y={-8}
          width={40}
          height={16}
          fill="#1f2937"
          cornerRadius={3}
          stroke="rgba(129, 140, 248, 0.3)"
          strokeWidth={1}
        />
        <Text
          text={label}
          fontSize={10}
          fill="#c084fc"
          align="center"
          verticalAlign="middle"
          width={40}
          height={16}
          x={-20}
          y={-8}
          fontStyle="bold"
        />
      </Group>
    </Group>
  );
};

const VerticalMeasure = ({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) => {
  const midY = (y1 + y2) / 2;
  const strokeColor = '#818cf8';
  return (
    <Group>
      <Line points={[x, y1, x, y2]} stroke={strokeColor} strokeWidth={1} dash={[4, 4]} />
      <Line points={[x - 5, y1, x + 5, y1]} stroke={strokeColor} strokeWidth={1.5} />
      <Line points={[x - 5, y2, x + 5, y2]} stroke={strokeColor} strokeWidth={1.5} />
      <Group x={x} y={midY} rotation={90}>
        <Rect
          x={-20}
          y={-8}
          width={40}
          height={16}
          fill="#1f2937"
          cornerRadius={3}
          stroke="rgba(129, 140, 248, 0.3)"
          strokeWidth={1}
        />
        <Text
          text={label}
          fontSize={10}
          fill="#c084fc"
          align="center"
          verticalAlign="middle"
          width={40}
          height={16}
          x={-20}
          y={-8}
          fontStyle="bold"
        />
      </Group>
    </Group>
  );
};

const DesignLayer = observer(({ selectedNodeId, selectedDesignElementId, setSelectedDesignElementId, setAddMenuOverlay, isExport = false }: { selectedNodeId: string | null, selectedDesignElementId: string | null, setSelectedDesignElementId?: (id: string | null) => void, setAddMenuOverlay?: (overlay: Record<string, unknown> | string | number | boolean) => void, isExport?: boolean }) => {
  const { designElements, flattenedLayout, layoutBounds } = configStore;
  const scale = DESIGN_SCALE;
  const showMeas = !isExport && configStore.showMeasurements;
  const trRef = useRef<Record<string, unknown>>(null);

  useEffect(() => {
    if (trRef.current) {
      if (selectedDesignElementId) {
        const stage = trRef.current.getStage();
        const node = stage?.findOne('#' + selectedDesignElementId);
        if (node) {
          trRef.current.nodes([node]);
          trRef.current.forceUpdate();
          trRef.current.getLayer().batchDraw();
        } else {
          trRef.current.nodes([]);
        }
      } else {
        trRef.current.nodes([]);
      }
    }
  }, [selectedDesignElementId, designElements]);

  const drawHolesCCW = (ctx: Record<string, unknown> | string | number | boolean, node: THREE.Object3D, h: number, scale: number, bleedOffset: number = 0) => {
    if (!node.holes || node.holes.length === 0) return;

    node.holes.forEach((hole: Record<string, unknown> | string | number | boolean) => {
      const factorX = node.flipped ? -1 : 1;
      const cx = hole.x * factorX * scale;
      const cy = -h * scale / 2 - hole.y * scale;

      const adapter = {
        moveTo: (x: number, y: number) => ctx.moveTo(x, y),
        lineTo: (x: number, y: number) => ctx.lineTo(x, y),
        bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y),
        closePath: () => ctx.closePath()
      };

      drawUniversalHole(adapter, hole, cx, cy, scale, bleedOffset, factorX, false, false, configStore.templates);
    });
  };

  const clipLayout = (ctx: Record<string, unknown> | string | number | boolean) => {
    ctx.beginPath();
    Object.values(flattenedLayout).forEach(({ node, x, y, w, h, rotation }) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      if (node.type === 'panel') {
        ctx.rect(-w * scale / 2, -h * scale, w * scale, h * scale);
      } else {
        // Flap
        const template = node.shapeTemplateId ? configStore.templates[node.shapeTemplateId] : null;
        const path = template ? template.path : [];
        if (path.length > 0) {
          const factorX = node.flipped ? -1 : 1;
          const cwPath = getClockwisePath(path, !!node.flipped);
          cwPath.forEach((cmd) => {
            const cx = cmd.x * factorX * w * scale;
            const cy = -cmd.y * h * scale;

            if (cmd.type === 'M') {
              ctx.moveTo(cx, cy);
            } else if (cmd.type === 'L') {
              ctx.lineTo(cx, cy);
            } else if (cmd.type === 'C') {
              const cp1x = cmd.cp1x! * factorX * w * scale;
              const cp1y = -cmd.cp1y! * h * scale;
              const cp2x = cmd.cp2x! * factorX * w * scale;
              const cp2y = -cmd.cp2y! * h * scale;
              ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
            }
          });
          ctx.closePath();
        } else {
          ctx.rect(-w * scale / 2, -h * scale, w * scale, h * scale);
        }
      }

      drawHolesCCW(ctx, node, h, scale);
      ctx.restore();
    });
  };

  const clipBleed = (ctx: Record<string, unknown> | string | number | boolean) => {
    const BLEED = 8;
    ctx.beginPath();
    Object.values(flattenedLayout).forEach(({ node, x, y, w, h, rotation }) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      const pw = w * scale;
      const ph = h * scale;

      if (node.type === 'panel') {
        ctx.rect(-pw / 2 - BLEED, -ph - BLEED, pw + 2 * BLEED, ph + 2 * BLEED);
      } else {
        // Flap
        const template = node.shapeTemplateId ? configStore.templates[node.shapeTemplateId] : null;
        const path = template ? template.path : [];
        if (path.length > 0) {
          const factorX = node.flipped ? -1 : 1;
          const scaleX = (pw + 2 * BLEED) / pw;
          const scaleY = (ph + 2 * BLEED) / ph;

          const cwPath = getClockwisePath(path, !!node.flipped);
          cwPath.forEach((cmd) => {
            const cx = cmd.x * factorX * pw * scaleX;
            const cy = -cmd.y * ph * scaleY + BLEED;

            if (cmd.type === 'M') {
              ctx.moveTo(cx, cy);
            } else if (cmd.type === 'L') {
              ctx.lineTo(cx, cy);
            } else if (cmd.type === 'C') {
              const cp1x = cmd.cp1x! * factorX * pw * scaleX;
              const cp1y = -cmd.cp1y! * ph * scaleY + BLEED;
              const cp2x = cmd.cp2x! * factorX * pw * scaleX;
              const cp2y = -cmd.cp2y! * ph * scaleY + BLEED;
              ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
            }
          });
          ctx.closePath();
        } else {
          ctx.rect(-pw / 2 - BLEED, -ph - BLEED, pw + 2 * BLEED, ph + 2 * BLEED);
        }
      }

      drawHolesCCW(ctx, node, h, scale, BLEED);
      ctx.restore();
    });
  };

  return (
    <Layer>
      <Rect x={0} y={0} width={layoutBounds.width} height={layoutBounds.height} fill="#1a1d24" />

      <Group x={-layoutBounds.minX} y={-layoutBounds.minY}>
        <Group>
          {Object.values(flattenedLayout).map(({ node, x, y, w, h, rotation, incomingEdge }) => {
            if (node.type === 'panel') {
              return (
                <Group key={node.id} x={x} y={y} rotation={rotation}>
                  <Rect
                    x={-w * scale / 2}
                    y={-h * scale}
                    width={Math.max(1, w * scale)}
                    height={Math.max(1, h * scale)}
                    fill={configStore.activePattern === 'none' ? node.color : undefined}
                    fillPatternImage={configStore.activePattern !== 'none' ? getPatternCanvasCached(configStore.activePattern, node.color) as HTMLCanvasElement : undefined}
                    fillPatternRepeat="repeat"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      configStore.setSelectedNodeId(node.id);
                    }}
                    onTap={(e) => {
                      e.cancelBubble = true;
                      configStore.setSelectedNodeId(node.id);
                    }}
                  />
                  <Text
                    x={-w * scale / 2}
                    y={-h * scale / 2 - 10}
                    width={Math.max(1, w * scale)}
                    text={node.name}
                    align="center"
                    fontSize={20}
                    fill="rgba(0,0,0,0.5)"
                  />

                  {node.holes && node.holes.length > 0 && (
                    <Group>
                      {node.holes.map(hole => (
                        <HoleShapeRender key={hole.id} hole={hole} factorX={node.flipped ? -1 : 1} h={h} scale={scale} />
                      ))}
                    </Group>
                  )}

                  {showMeas && (
                    <>
                      <HorizontalMeasure
                        x1={-w * scale / 2}
                        x2={w * scale / 2}
                        y={15}
                        label={configStore.getFormattedValue(w)}
                      />
                      <VerticalMeasure
                        x={-w * scale / 2 - 15}
                        y1={-h * scale}
                        y2={0}
                        label={configStore.getFormattedValue(h)}
                      />
                    </>
                  )}

                  {/* Plus Buttons for Empty Edges */}
                  {selectedNodeId === node.id && (
                    <>
                      {(['top', 'bottom', 'left', 'right'] as const).map(edge => {
                        if (!node.attachments[edge] && edge !== incomingEdge) {
                          let bx = 0;
                          let by = 0;
                          if (edge === 'top') by = -h * scale;
                          else if (edge === 'bottom') by = 0;
                          else if (edge === 'left') { bx = -w * scale / 2; by = -h * scale / 2; }
                          else if (edge === 'right') { bx = w * scale / 2; by = -h * scale / 2; }

                          return (
                            <Group
                              key={`plus-${edge}`}
                              x={bx}
                              y={by}
                              onClick={(e) => {
                                e.cancelBubble = true;
                                const pos = e.target.getAbsolutePosition();
                                setAddMenuOverlay({ x: pos.x, y: pos.y, nodeId: node.id, edge });
                              }}
                              onTap={(e) => {
                                e.cancelBubble = true;
                                const pos = e.target.getAbsolutePosition();
                                setAddMenuOverlay({ x: pos.x, y: pos.y, nodeId: node.id, edge });
                              }}
                            >
                              <Circle radius={16} fill="#4f46e5" />
                              <Text text="+" fill="white" fontSize={24} align="center" verticalAlign="middle" x={-7} y={-11} fontStyle="bold" />
                            </Group>
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
                </Group>
              );
            } else {
              // Terminal Flap
              return (
                <Group key={node.id} x={x} y={y} rotation={rotation}>
                  <FlapShapeRender
                    node={node}
                    w={w}
                    h={h}
                  />

                  {node.holes && node.holes.length > 0 && (
                    <Group>
                      {node.holes.map(hole => (
                        <HoleShapeRender key={hole.id} hole={hole} factorX={node.flipped ? -1 : 1} h={h} scale={scale} />
                      ))}
                    </Group>
                  )}

                  {showMeas && (
                    <>
                      <HorizontalMeasure
                        x1={-w * scale / 2}
                        x2={w * scale / 2}
                        y={15}
                        label={configStore.getFormattedValue(w)}
                      />
                      <VerticalMeasure
                        x={-w * scale / 2 - 15}
                        y1={-h * scale}
                        y2={0}
                        label={configStore.getFormattedValue(h)}
                      />
                    </>
                  )}
                </Group>
              );
            }
          })}
        </Group>

        {/* Keep UI Overlays normal Y-down, but masked to the bleeding area (layout expanded by 8px) */}
        <Group clipFunc={clipBleed}>
          {designElements.map((el, i) => {
            if (el.type === 'text') {
              return (
                <DesignText
                  key={el.id}
                  id={el.id}
                  {...el}
                  onSelect={(e: Event) => {
                    if (e) e.cancelBubble = true;
                    setSelectedDesignElementId?.(el.id);
                    configStore.setSelectedNodeId(null);
                  }}
                  onChange={(newAttrs: Record<string, unknown> | string | number | boolean) => {
                    Object.assign(configStore.designElements[i], newAttrs);
                  }}
                />
              );
            } else if (el.type === 'logo') {
              return (
                <DesignImage
                  key={el.id}
                  id={el.id}
                  {...el}
                  onSelect={(e: Event) => {
                    if (e) e.cancelBubble = true;
                    setSelectedDesignElementId?.(el.id);
                    configStore.setSelectedNodeId(null);
                  }}
                  onChange={(newAttrs: Record<string, unknown> | string | number | boolean) => {
                    Object.assign(configStore.designElements[i], newAttrs);
                  }}
                />
              );
            }
            return null;
          })}
        </Group>

        {/* Dotted green bleeding outline overlay */}
        {!isExport && (
          <Shape
            stroke="#22c55e"
            strokeWidth={1.5}
            dash={[4, 4]}
            listening={false}
            sceneFunc={(ctx, shape) => {
              const stage = shape.getStage();
              if (!stage) return;
              const dpr = window.devicePixelRatio || 1;
              const stageW = stage.width();
              const stageH = stage.height();
              const w = stageW * dpr;
              const h = stageH * dpr;

              // Create offscreen canvas to perform destination-out operations
              const offCanvas = document.createElement('canvas');
              offCanvas.width = w;
              offCanvas.height = h;
              const offCtx = offCanvas.getContext('2d');
              if (!offCtx) return;

              // Match the absolute transform of the shape, scaled by DPR
              const transform = shape.getAbsoluteTransform();
              const matrix = transform.m;
              offCtx.setTransform(matrix[0] * dpr, matrix[1] * dpr, matrix[2] * dpr, matrix[3] * dpr, matrix[4] * dpr, matrix[5] * dpr);

              // Step 1: Draw the thick dashed stroke (8px bleed offset + 2px stroke = 18px lineWidth)
              clipLayout(offCtx);
              offCtx.strokeStyle = '#22c55e';
              offCtx.lineWidth = 18;
              offCtx.lineJoin = 'miter';
              offCtx.miterLimit = 1.5;
              offCtx.setLineDash([8, 8]);
              offCtx.stroke();

              // Step 2: Erase the inner stroke with solid destination-out (8px bleed offset - 2px stroke = 14px lineWidth)
              offCtx.globalCompositeOperation = 'destination-out';
              clipLayout(offCtx);
              offCtx.strokeStyle = 'black';
              offCtx.lineWidth = 14;
              offCtx.lineJoin = 'miter';
              offCtx.miterLimit = 1.5;
              offCtx.setLineDash([]);
              offCtx.stroke();

              // Step 3: Erase the layout interior
              clipLayout(offCtx);
              offCtx.fillStyle = 'black';
              offCtx.fill();

              // Draw offscreen canvas back to the main context
              ctx.save();
              const inv = transform.copy().invert();
              const invM = inv.m;
              // Apply inverse to get back to stage coordinate space (CSS pixels)
              ctx.transform(invM[0], invM[1], invM[2], invM[3], invM[4], invM[5]);
              ctx.drawImage(offCanvas, 0, 0, stageW, stageH);
              ctx.restore();
            }}
          />
        )}

        {/* Unclipped Transformer for Editing */}
        {!isExport && selectedDesignElementId && (() => {
          const el = designElements.find(e => e.id === selectedDesignElementId);
          const isText = el?.type === 'text';
          return (
            <Transformer
              ref={trRef}
              enabledAnchors={
                isText
                  ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
                  : undefined
              }
            />
          );
        })()}
      </Group>
    </Layer>
  );
});

export const Editor2D = observer(() => {
  const [stageScale, setStageScale] = useState(0.4);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const stageRef = useRef<Record<string, unknown>>(null);
  const exportStageRef = useRef<Record<string, unknown>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const prevWidthRef = useRef(0);
  const stageScaleRef = useRef(stageScale);

  useEffect(() => {
    stageScaleRef.current = stageScale;
  }, [stageScale]);

  // Overlay state for adding nodes
  const [addMenuOverlay, setAddMenuOverlay] = useState<{ x: number; y: number; nodeId: string; edge: 'top' | 'bottom' | 'left' | 'right' } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight;
        setDimensions({ width: w, height: h });

        if (w > 0 && prevWidthRef.current === 0) {
          setStagePos({
            x: w / 2 - (configStore.layoutBounds.width / 2) * stageScaleRef.current,
            y: h / 2 - (configStore.layoutBounds.height / 2) * stageScaleRef.current
          });
        }
        prevWidthRef.current = w;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateTexture = () => {
    if (exportStageRef.current && configStore.layoutBounds.width > 0 && configStore.layoutBounds.height > 0) {
      try {
        const canvas = exportStageRef.current.toCanvas({ pixelRatio: 1 });
        configStore.setTextureCanvas(canvas);
      } catch (_err) {
        // Ignore temporary empty canvas errors during render/resizing
      }
    }
  };

  useEffect(() => {
    let timeoutId: Record<string, unknown> | string | number | boolean;
    import('mobx').then(({ reaction }) => {
      const disposer = reaction(
        () => {
          return [
            configStore.designElements.map(el => ({ ...el })),
            JSON.stringify(configStore.rootNode),
            JSON.stringify(configStore.flattenedLayout),
            JSON.stringify(configStore.templates),
            JSON.stringify(configStore.layoutBounds),
            configStore.activePattern
          ];
        },
        () => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(updateTexture, 150);
        },
        { fireImmediately: true }
      );
      return () => {
        disposer();
        if (timeoutId) clearTimeout(timeoutId);
      };
    });
  }, []);

  const handleWheel = (e: Event) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);
    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const addText = () => {
    const id = Date.now().toString();
    const b = configStore.layoutBounds;
    configStore.designElements.push({
      id, type: 'text', text: 'New Text', x: b.minX + b.width / 2, y: b.minY + b.height / 2, scale: 1, color: '#000000', fontSize: 24, fontFamily: 'sans-serif', rotation: 0
    });
    configStore.setSelectedDesignElementId(id);
    configStore.setSelectedNodeId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          const id = Date.now().toString();
          const b = configStore.layoutBounds;
          const targetWidth = 150;
          const scale = targetWidth / img.width;
          const targetHeight = img.height * scale;

          configStore.designElements.push({
            id,
            type: 'logo',
            src: reader.result as string,
            x: b.minX + b.width / 2 - targetWidth / 2,
            y: b.minY + b.height / 2 - targetHeight / 2,
            width: targetWidth,
            height: targetHeight,
            scale: 1,
            rotation: 0
          });
          configStore.setSelectedDesignElementId(id);
          configStore.setSelectedNodeId(null);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const checkDeselect = (e: Event) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      configStore.setSelectedDesignElementId(null);
      configStore.setSelectedNodeId(null);
    }
  };

  const zoomIn = () => {
    setStageScale(prev => Math.min(5, prev * 1.15));
  };

  const zoomOut = () => {
    setStageScale(prev => Math.max(0.05, prev / 1.15));
  };

  const recenter = () => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      setStageScale(0.4);
      setStagePos({
        x: w / 2 - (configStore.layoutBounds.width / 2) * 0.4,
        y: h / 2 - (configStore.layoutBounds.height / 2) * 0.4
      });
    }
  };

  return (
    <div className="editor-2d-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div className="header" style={{ padding: '16px', backgroundColor: '#333' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Design Workspace</h2>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
          <button className="nav-button" onClick={addText}>+ Add Text</button>
          <label className="nav-button" style={{ cursor: 'pointer', background: '#444', padding: '4px 8px', borderRadius: '4px' }}>
            + Add Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {dimensions.width > 0 && dimensions.height > 0 && (
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onWheel={handleWheel}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stagePos.x}
            y={stagePos.y}
            ref={stageRef}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            draggable
            onDragEnd={(e) => {
              if (e.target === e.target.getStage()) {
                setStagePos({ x: e.target.x(), y: e.target.y() });
              }
            }}
          >
            <DesignLayer
              selectedNodeId={configStore.selectedNodeId}
              selectedDesignElementId={configStore.selectedDesignElementId}
              setSelectedDesignElementId={(id) => configStore.setSelectedDesignElementId(id)}
              setAddMenuOverlay={setAddMenuOverlay}
            />
          </Stage>
        )}

        {/* Bottom Toolbar for 2D Layout Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(26, 29, 36, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--color-border)',
            borderRadius: '24px',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            zIndex: 5
          }}
        >
          {/* Zoom Out Button */}
          <button
            onClick={zoomOut}
            title="Zoom Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              outline: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Zoom Label */}
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', minWidth: '40px', textAlign: 'center', fontWeight: 'bold' }}>
            {Math.round(stageScale * 100)}%
          </span>

          {/* Zoom In Button */}
          <button
            onClick={zoomIn}
            title="Zoom In"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              outline: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

          {/* Recenter Button */}
          <button
            onClick={recenter}
            title="Recenter View"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              outline: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

          {/* Toggle Measurements Button */}
          <button
            onClick={() => configStore.setShowMeasurements(!configStore.showMeasurements)}
            title="Toggle Dimensions"
            style={{
              background: configStore.showMeasurements ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
              border: '1px solid ' + (configStore.showMeasurements ? '#818cf8' : 'rgba(255,255,255,0.15)'),
              color: configStore.showMeasurements ? '#a5b4fc' : 'var(--color-text-muted)',
              padding: '6px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M3 3v18h18" />
              <path d="M18 9l-3 3-3-3" />
            </svg>
          </button>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

          {/* Export SVG Button */}
          <button
            onClick={() => configStore.exportDielineToSVG()}
            title="Export Dieline (SVG)"
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid #6366f1',
              color: '#a5b4fc',
              padding: '6px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'; e.currentTarget.style.color = '#a5b4fc'; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />

          {/* Units Selection Dropdown */}
          <select
            value={configStore.activeUnit}
            onChange={(e) => configStore.setUnit(e.target.value as 'cm' | 'in' | 'mm')}
            title="Select Display Unit"
            style={{
              background: 'rgba(26, 29, 36, 0.85)',
              color: 'var(--color-text-muted)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              outline: 'none',
              cursor: 'pointer',
              height: '28px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
          >
            <option value="in">in</option>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
          </select>
        </div>

        {/* HTML Context Menu Overlay for Adding Attachments */}
        {addMenuOverlay && (
          <div
            style={{
              position: 'absolute',
              left: addMenuOverlay.x,
              top: addMenuOverlay.y,
              background: '#2d3748',
              border: '1px solid #4a5568',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              zIndex: 10,
              transform: 'translate(-50%, -100%)', // Center above the click point
              marginTop: '-16px'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: '4px', textAlign: 'center', fontWeight: 'bold' }}>Add to {addMenuOverlay.edge}</div>
            <button
              style={{ background: '#4a5568', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => { configStore.addAttachment(addMenuOverlay.nodeId, addMenuOverlay.edge, 'panel'); setAddMenuOverlay(null); }}
            >+ Add Panel</button>
            <button
              style={{ background: '#4a5568', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => { configStore.addAttachment(addMenuOverlay.nodeId, addMenuOverlay.edge, 'flap'); setAddMenuOverlay(null); }}
            >+ Add Flap</button>
            <button
              style={{ background: '#4a5568', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => { configStore.addAttachment(addMenuOverlay.nodeId, addMenuOverlay.edge, 'tuck'); setAddMenuOverlay(null); }}
            >+ Add Tuck</button>
            <button
              style={{ background: 'transparent', color: '#fc8181', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginTop: '4px' }}
              onClick={() => setAddMenuOverlay(null)}
            >Cancel</button>
          </div>
        )}

        {/* Hidden Export Stage (Dynamic Bounds Size) */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <Stage
            width={Number.isFinite(configStore.layoutBounds.width) ? Math.max(100, Math.ceil(configStore.layoutBounds.width)) : 100}
            height={Number.isFinite(configStore.layoutBounds.height) ? Math.max(100, Math.ceil(configStore.layoutBounds.height)) : 100}
            ref={exportStageRef}
          >
            <DesignLayer
              selectedNodeId={null}
              selectedDesignElementId={null}
              setAddMenuOverlay={setAddMenuOverlay}
              isExport={true}
            />
          </Stage>
        </div>
      </div>
    </div>
  );
});
