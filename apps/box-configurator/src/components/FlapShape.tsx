import React from 'react';
import { Shape, Group } from 'react-konva';
import { observer } from 'mobx-react-lite';
import { configStore, BoxNode } from '../store/ConfigStore';
import { DESIGN_SCALE, getPatternCanvasCached } from '@trikomi/core/box';

interface FlapShapeProps {
  node: BoxNode;
  w: number;
  h: number;
}

export const FlapShapeRender = observer(({ node, w, h }: FlapShapeProps) => {
  const template = node.shapeTemplateId ? configStore.templates[node.shapeTemplateId] : null;
  const path = template ? template.path : [];
  const isFlipped = !!node.flipped;
  const pathKey = JSON.stringify(path);

  return (
    <Group>
      <Shape
        key={`${node.id}-${isFlipped}-${node.shapeTemplateId || 'none'}-${pathKey}`}
        width={w}
        height={h}
        fill={configStore.activePattern === 'none' ? (node.color || '#ffffff') : undefined}
        fillPatternImage={configStore.activePattern !== 'none' ? getPatternCanvasCached(configStore.activePattern, node.color || '#ffffff') as HTMLCanvasElement : undefined}
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
        sceneFunc={(context, shape) => {
          context.beginPath();
          
          if (path.length > 0) {
            const factorX = node.flipped ? -1 : 1;
            path.forEach((cmd) => {
              const cx = cmd.x * factorX * w * DESIGN_SCALE;
              const cy = -cmd.y * h * DESIGN_SCALE;
              
              if (cmd.type === 'M') {
                context.moveTo(cx, cy);
              } else if (cmd.type === 'L') {
                context.lineTo(cx, cy);
              } else if (cmd.type === 'C') {
                const cp1x = cmd.cp1x! * factorX * w * DESIGN_SCALE;
                const cp1y = -cmd.cp1y! * h * DESIGN_SCALE;
                const cp2x = cmd.cp2x! * factorX * w * DESIGN_SCALE;
                const cp2y = -cmd.cp2y! * h * DESIGN_SCALE;
                context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
              }
            });
          } else {
            // Fallback Rect if no template
            context.rect(-w * DESIGN_SCALE / 2, -h * DESIGN_SCALE, w * DESIGN_SCALE, h * DESIGN_SCALE);
          }
          
          context.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
});
