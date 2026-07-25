import { useRef, useState, useEffect } from 'react';
import { useLocalImage } from '../../hooks/useLocalImage';

const zoomBtnStyle = {
  width: 30, height: 30,
  borderRadius: '50%',
  background: 'var(--color-panel)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  border: '1px solid var(--color-panel-border)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  transition: 'var(--transition-smooth)',
  fontSize: '1rem',
};

const HotspotImagePreview = ({ tourId, url, alt, style }) => {
  const localUrl = useLocalImage(tourId, url);
  if (!localUrl) return <div style={{ ...style, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '0.6rem' }}>…</span></div>;
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return <video src={localUrl} muted loop autoPlay playsInline style={style} />;
  }
  return <img src={localUrl} alt={alt} style={style} />;
};

const ImageWithHotspots = ({
  tourId,
  panorama,
  hotspots,
  shapes,
  audio_points = [],
  hotspotCreationMode,
  shapeCreationMode,
  audioPointCreationMode,
  initialViewCreationMode,
  currentShape,
  onImageClick,
  onShapeClick
}) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  const [currentShapePoints, setCurrentShapePoints] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  const localPanoramaUrl = useLocalImage(tourId, panorama);

  // Zoom/Pan state
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFreeDrawing, setIsFreeDrawing] = useState(false);

  const updateDimensions = () => {
    if (imgRef.current && containerRef.current) {
      const img = imgRef.current;
      const containerRect = containerRef.current.getBoundingClientRect();
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      if (naturalWidth === 0) return;

      setImgDimensions({ width: naturalWidth, height: naturalHeight, naturalWidth, naturalHeight });
      const scaleX = containerRect.width / naturalWidth;
      const scaleY = containerRect.height / naturalHeight;
      const initialScale = Math.min(scaleX, scaleY) * 0.9;
      setScale(initialScale);
      setOffsetX((containerRect.width - naturalWidth * initialScale) / 2);
      setOffsetY((containerRect.height - naturalHeight * initialScale) / 2);
    }
  };

  const resetView = () => { updateDimensions(); };

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      if (img.complete) updateDimensions();
      else img.onload = updateDimensions;
    }
  }, [localPanoramaUrl]);

  useEffect(() => { if (!shapeCreationMode) setCurrentShapePoints([]); }, [shapeCreationMode]);

  const handleClick = (e) => {
    if (isDragging || !imgRef.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    if (hotspotCreationMode || audioPointCreationMode || initialViewCreationMode) {
      const imgX = (mouseX - offsetX) / scale;
      const imgY = (mouseY - offsetY) / scale;
      const normX = imgX / imgDimensions.naturalWidth;
      const normY = imgY / imgDimensions.naturalHeight;
      if (normX < 0 || normX > 1 || normY < 0 || normY > 1) return;
      const yaw = (normX * 360) - 180;
      const pitch = 90 - (normY * 180);
      onImageClick(yaw, pitch);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setIsDragging(true);
      setOffsetX(prev => prev + e.movementX);
      setOffsetY(prev => prev + e.movementY);
      return;
    }
    if (shapeCreationMode && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      const x = (mouseX - offsetX) / scale;
      const y = (mouseY - offsetY) / scale;
      setMousePos({ x, y });

      if (isFreeDrawing && onShapeClick) {
        const points = currentShapePoints.length > 0 ? currentShapePoints : (currentShape?.points || []);
        if (points.length > 0) {
          const lastPoint = points[points.length - 1];
          const distance = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
          if (distance > 10 / scale) {
            setCurrentShapePoints(prev => [...prev, { x, y }]);
            onShapeClick(x, y);
          }
        }
      }
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(10, scale * delta));
    setOffsetX(mouseX - (mouseX - offsetX) * (newScale / scale));
    setOffsetY(mouseY - (mouseY - offsetY) * (newScale / scale));
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      setIsDragging(false);
    } else if (e.button === 0 && shapeCreationMode && containerRef.current) {
      setIsFreeDrawing(true);
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      const x = (mouseX - offsetX) / scale;
      const y = (mouseY - offsetY) / scale;
      if (x >= 0 && x <= imgDimensions.naturalWidth && y >= 0 && y <= imgDimensions.naturalHeight) {
        const points = currentShapePoints.length > 0 ? currentShapePoints : (currentShape?.points || []);
        let shouldAdd = true;
        if (points.length > 0) {
          const lastPoint = points[points.length - 1];
          const distance = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
          if (distance < 5 / scale) shouldAdd = false;
        }
        if (shouldAdd) {
          setCurrentShapePoints(prev => [...prev, { x, y }]);
          if (onShapeClick) onShapeClick(x, y);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsFreeDrawing(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const zoomTo = (factor) => {
    const newScale = Math.max(0.1, Math.min(10, scale * factor));
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      setOffsetX(midX - (midX - offsetX) * (newScale / scale));
      setOffsetY(midY - (midY - offsetY) * (newScale / scale));
    }
    setScale(newScale);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#000' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom/Pan Controls */}
      <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => zoomTo(1.2)} style={zoomBtnStyle} title="Zoom In">+</button>
        <button onClick={() => zoomTo(0.8)} style={zoomBtnStyle} title="Zoom Out">−</button>
        <button onClick={resetView} style={zoomBtnStyle} title="Reset View">⌂</button>
      </div>

      {/* Scale indicator */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 20, background: 'var(--color-panel)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.7rem', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--color-panel-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
        Zoom: {Math.round(scale * 100)}%
      </div>

      {/* Transform wrapper */}
      <div
        style={{
          position: 'absolute', inset: 0,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <div
          style={{
            position: 'relative', display: 'inline-block',
            width: imgDimensions.naturalWidth || 'auto',
            height: imgDimensions.naturalHeight || 'auto'
          }}
        >
          <img
            ref={imgRef}
            src={localPanoramaUrl || panorama}
            alt="Panorama"
            onClick={handleClick}
            onLoad={updateDimensions}
            style={{
              display: 'block',
              width: imgDimensions.naturalWidth || 'auto',
              height: imgDimensions.naturalHeight || 'auto',
              maxWidth: 'none',
              cursor: hotspotCreationMode || shapeCreationMode ? 'crosshair' : isPanning ? 'grabbing' : 'grab',
            }}
            draggable={false}
          />

          {/* Shapes overlay using SVG */}
          {imgDimensions.naturalWidth > 0 && (
            <svg
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: imgDimensions.width, height: imgDimensions.height }}
              viewBox={`0 0 ${imgDimensions.naturalWidth} ${imgDimensions.naturalHeight}`}
              preserveAspectRatio="none"
            >
              {/* Current shape being created */}
              {(currentShapePoints.length > 0 || (currentShape && currentShape.points)) && (
                <>
                  {(currentShapePoints.length > 1 || (currentShape && currentShape.points.length > 1)) && (
                    <polyline
                      points={(currentShapePoints.length > 0 ? currentShapePoints : currentShape.points).map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none" stroke="#ffff00" strokeWidth="3"
                    />
                  )}
                  {(currentShapePoints.length > 0 || (currentShape && currentShape.points.length > 0)) && (
                    <line
                      x1={(currentShapePoints.length > 0 ? currentShapePoints : currentShape.points)[(currentShapePoints.length > 0 ? currentShapePoints : currentShape.points).length - 1].x}
                      y1={(currentShapePoints.length > 0 ? currentShapePoints : currentShape.points)[(currentShapePoints.length > 0 ? currentShapePoints : currentShape.points).length - 1].y}
                      x2={mousePos.x} y2={mousePos.y}
                      stroke="#ffff00" strokeWidth="2" strokeDasharray="5,5" opacity="0.7"
                    />
                  )}
                  {(currentShapePoints.length > 0 ? currentShapePoints : (currentShape ? currentShape.points : [])).map((point, index) => (
                    <circle key={index} cx={point.x} cy={point.y} r="5" fill="#ffff00" stroke="#ffffff" strokeWidth="2" />
                  ))}
                </>
              )}

              {/* Existing shapes */}
              {(shapes || []).map((shape) => {
                if (!shape.points || shape.points.length < 2) return null;
                return (
                  <polygon
                    key={shape.id}
                    points={shape.points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill={shape.style?.fillColor || 'rgba(255, 255, 255, 0.3)'}
                    stroke={shape.style?.strokeColor || '#ff0000'}
                    strokeWidth={shape.style?.lineWidth || 3}
                  />
                );
              })}
            </svg>
          )}

          {/* Hotspots */}
          {imgDimensions.naturalWidth > 0 && hotspots?.map((hotspot) => {
            const left = ((parseFloat(hotspot.yaw) + 180) / 360) * 100;
            const top = ((90 - parseFloat(hotspot.pitch)) / 180) * 100;
            const isHovered = hoveredHotspot === hotspot.id;

            return (
              <div
                key={hotspot.id}
                style={{
                  position: 'absolute', left: `${left}%`, top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
                onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                {hotspot.thumbnail || hotspot.targetScene?.thumbnail ? (
                  <div style={{ position: 'relative' }}>
                    <HotspotImagePreview
                      tourId={tourId}
                      url={hotspot.thumbnail || hotspot.targetScene?.thumbnail}
                      alt={hotspot.title || 'Hotspot'}
                      style={{
                        width: 40, height: 40, borderRadius: '50%', objectFit: 'cover',
                        border: `2px solid ${isHovered ? 'var(--color-warning)' : 'var(--color-danger)'}`,
                        boxShadow: isHovered ? '0 0 12px rgba(245,158,11,0.5)' : 'none',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: isHovered ? 'var(--color-warning)' : 'var(--color-danger)',
                    border: `2px solid ${isHovered ? '#b45309' : '#991b1b'}`,
                  }} />
                )}
                <span style={{ fontSize: '0.65rem', color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '1px 4px', borderRadius: 'var(--radius-sm)', marginTop: 2 }}>
                  {hotspot.title || `Hotspot ${hotspot.id}`}
                </span>
              </div>
            );
          })}

          {/* Audio points */}
          {imgDimensions.naturalWidth > 0 && audio_points?.map((point) => {
            const left = ((parseFloat(point.yaw) + 180) / 360) * 100;
            const top = ((90 - parseFloat(point.pitch)) / 180) * 100;
            return (
              <div
                key={point.id}
                style={{
                  position: 'absolute', left: `${left}%`, top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(37,99,235,0.8)', border: '2px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                  <span style={{ fontSize: '0.75rem' }}>🔊</span>
                </div>
                <span style={{ fontSize: '0.6rem', color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '1px 4px', borderRadius: 'var(--radius-sm)', marginTop: 2 }}>
                  {point.title || `Audio ${point.id}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageWithHotspots;
