import { useEffect, useRef, useState } from 'react';
import tourApi from '../api/tourApi';
import { isPointInOutline, serializeShapesToJSON, parseShapesFromJSON } from '@trikomi/core/tour';

const PanoramaEditor2D = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const jsonInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [_imageFilename, setImageFilename] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isFreeDrawing, setIsFreeDrawing] = useState(false);
  const [outlines, setOutlines] = useState([]);
  const [currentOutline, setCurrentOutline] = useState(null);
  const [hoveredOutline, setHoveredOutline] = useState(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showDebugUVs, setShowDebugUVs] = useState(false);

  const [image, setImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  
  // Tour data for dropdown
  const [tourData, setTourData] = useState(null);
  const [selectedSceneId, setSelectedSceneId] = useState('');
  
  // Mouse position for preview line
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Load tour data from API on mount
  useEffect(() => {
    tourApi.getTour(1)
      .then(data => {
        setTourData(data);
        // Auto-select first scene
        if (data.scenes && data.scenes.length > 0) {
          setSelectedSceneId(data.scenes[0].id);
        }
      })
      .catch(err => {
        console.error('Failed to load tour from API:', err);
        // Fallback to static JSON
        fetch('/tour.json')
          .then(res => res.json())
          .then(data => {
            setTourData(data);
            if (data.scenes && data.scenes.length > 0) {
              setSelectedSceneId(data.scenes[0].id);
            }
          });
      });
  }, []);

  // Load image when selected scene changes
  useEffect(() => {
    if (!containerRef.current || !selectedSceneId || !tourData) return;
    
    const scene = tourData.scenes.find(s => s.id === selectedSceneId);
    if (!scene) return;

    const canvas = canvasRef.current;
    const _ctx = canvas.getContext('2d');
    
    // Set canvas size to container size
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      setImageWidth(img.width);
      setImageHeight(img.height);
      setImageFilename(scene.panorama.split('/').pop());
      // Center the image initially
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8;
      setScale(scale);
      setOffsetX((canvas.width - img.width * scale) / 2);
      setOffsetY((canvas.height - img.height * scale) / 2);
      setOutlines([]);
      setCurrentOutline(null);
      draw();
    };
    img.onerror = () => {
      console.error('Failed to load image:', scene.panorama);
    };
    setUploadedImage(scene.panorama);
    img.src = scene.panorama;
  }, [selectedSceneId, tourData]);

  const draw = () => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image with transform
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    
    // Draw outlines
    outlines.forEach((outline) => {
      if (outline.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(outline.points[0].x, outline.points[0].y);
      outline.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      
      // Fill if hovered
      if (hoveredOutline === outline.id) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }
      
      ctx.strokeStyle = hoveredOutline === outline.id ? '#00ff00' : '#ff0000';
      ctx.lineWidth = 3 / scale;
      ctx.stroke();

      // Debug UVs
      if (showDebugUVs && outline.points.length >= 3) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        outline.points.forEach(p => {
          minX = Math.min(minX, p.x);
          maxX = Math.max(maxX, p.x);
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        });

        const padding = 0;
        const canvasWidth = Math.max(maxX - minX + padding * 2, 8);
        const canvasHeight = Math.max(maxY - minY + padding * 2, 8);

        // Draw Bounding Box (with padding)
        ctx.setLineDash([5 / scale, 5 / scale]);
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.strokeRect(minX - padding, minY - padding, canvasWidth, canvasHeight);
        ctx.setLineDash([]);

        // Draw UV labels for each point
        outline.points.forEach((p, _i) => {
          const u = (p.x - minX + padding) / canvasWidth;
          const v_three = 1 - (p.y - minY + padding) / canvasHeight;
          
          ctx.fillStyle = 'yellow';
          ctx.font = `bold ${12 / scale}px monospace`;
          ctx.fillText(`U:${u.toFixed(3)} V:${v_three.toFixed(3)}`, p.x + 5 / scale, p.y - 5 / scale);
          
          // Small circle at point
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 / scale, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
    
    // Draw current outline
    if (currentOutline && currentOutline.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentOutline[0].x, currentOutline[0].y);
      currentOutline.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3 / scale;
      ctx.stroke();
      
      // Draw preview line from last point to mouse position
      if (isDrawing && currentOutline.length > 0) {
        const lastPoint = currentOutline[currentOutline.length - 1];
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2 / scale;
        ctx.setLineDash([5 / scale, 5 / scale]); // Dashed line
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash
      }
    }
    
    ctx.restore();
  };

  useEffect(() => {
    draw();
  }, [scale, offsetX, offsetY, outlines, currentOutline, hoveredOutline, image, mousePos, isDrawing]);

  const handleSceneChange = (e) => {
    setSelectedSceneId(e.target.value);
  };

  // Export tour.json with shapes for current scene
  const saveShapesToJSON = () => {
    const json = serializeShapesToJSON(tourData, selectedSceneId, imageWidth, imageHeight, outlines);
    if (!json) {
      alert('No scene selected or no tour data available');
      return;
    }
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tour.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load shapes from tour.json
  const loadShapesFromJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const parsedOutlines = parseShapesFromJSON(data, selectedSceneId);
        
        if (parsedOutlines) {
          setOutlines(parsedOutlines);
          setCurrentOutline(null);
          console.log(`Loaded ${parsedOutlines.length} shapes`);
        } else {
          alert('Invalid JSON format: no scenes or shapes found');
        }
      } catch (err) {
        alert('Failed to parse JSON file');
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleMouseDown = (e) => {
    if (!uploadedImage) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale ratio between canvas CSS size and internal resolution
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const scaleX = canvas.width / cssWidth;
    const scaleY = canvas.height / cssHeight;
    
    // Adjust mouse coordinates to match internal canvas resolution
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const x = (mouseX - offsetX) / scale;
    const y = (mouseY - offsetY) / scale;

    // Check bounds
    if (x < 0 || x > imageWidth || y < 0 || y > imageHeight) return;

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse or alt+click for panning
      setIsPanning(true);
      setIsDragging(true);
    } else if (e.button === 0 && isDrawing) {
      // Left click for drawing
      if (!currentOutline) {
        setCurrentOutline([{ x, y }]);
        setIsFreeDrawing(true);
      } else {
        // Check if clicking near first point to auto-close
        const firstPoint = currentOutline[0];
        const distance = Math.sqrt(Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2));
        if (currentOutline.length >= 3 && distance < 20 / scale) {
          // Auto-close
          setOutlines([...outlines, { id: Date.now(), points: currentOutline }]);
          setCurrentOutline(null);
          setIsFreeDrawing(false);
        } else {
          setCurrentOutline([...currentOutline, { x, y }]);
          setIsFreeDrawing(true);
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!uploadedImage) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale ratio between canvas CSS size and internal resolution
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const scaleX = canvas.width / cssWidth;
    const scaleY = canvas.height / cssHeight;
    
    // Adjust mouse coordinates to match internal canvas resolution
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const x = (mouseX - offsetX) / scale;
    const y = (mouseY - offsetY) / scale;

    // Update mouse position for preview line
    setMousePos({ x, y });

    if (isPanning && isDragging) {
      // Scale movement to match canvas resolution
      const dx = e.movementX * scaleX;
      const dy = e.movementY * scaleY;
      setOffsetX(offsetX + dx);
      setOffsetY(offsetY + dy);
    } else if (isFreeDrawing && currentOutline && isDrawing) {
      // Free draw - add points continuously while dragging
      const lastPoint = currentOutline[currentOutline.length - 1];
      const distance = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
      // Only add point if moved enough (throttle)
      if (distance > 5 / scale) {
        setCurrentOutline([...currentOutline, { x, y }]);
      }
    } else if (!isDrawing) {
      // Hover detection
      let foundHovered = null;
      outlines.forEach(outline => {
        if (isPointInOutline(x, y, outline.points)) {
          foundHovered = outline.id;
        }
      });
      setHoveredOutline(foundHovered);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsDragging(false);
    setIsFreeDrawing(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale ratio between canvas CSS size and internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Adjust mouse coordinates to match internal canvas resolution
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(10, scale * zoomFactor));

    // Zoom towards mouse position
    setOffsetX(mouseX - (mouseX - offsetX) * (newScale / scale));
    setOffsetY(mouseY - (mouseY - offsetY) * (newScale / scale));
    setScale(newScale);
  };



  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (currentOutline && currentOutline.length > 2) {
      setOutlines([...outlines, { id: Date.now(), points: currentOutline }]);
      setCurrentOutline(null);
    }
  };

  const clearOutlines = () => {
    setOutlines([]);
    setCurrentOutline(null);
  };

  const saveOutline = () => {
    if (currentOutline && currentOutline.length > 2) {
      setOutlines([...outlines, { id: Date.now(), points: currentOutline }]);
      setCurrentOutline(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Drag & drop disabled - use dropdown to select panoramas from tour.json
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a1a', color: 'white' }}>
      <div style={{ padding: '20px', background: '#2a2a2a', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>360° 2D Editor</h2>
        {/* Scene selector dropdown */}
        {tourData && tourData.scenes && (
          <select
            value={selectedSceneId}
            onChange={handleSceneChange}
            style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer', minWidth: '200px' }}
          >
            {tourData.scenes.map(scene => (
              <option key={scene.id} value={scene.id} style={{ color: '#333' }}>
                {scene.name}
              </option>
            ))}
          </select>
        )}
        
        {uploadedImage && (
          <>
            <button
              onClick={toggleDrawing}
              style={{ padding: '8px 16px', borderRadius: '4px', background: isDrawing ? '#FF9800' : '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
            </button>
            <button
              onClick={() => setShowDebugUVs(!showDebugUVs)}
              style={{ padding: '8px 16px', borderRadius: '4px', background: showDebugUVs ? '#FFEB3B' : '#607D8B', color: showDebugUVs ? '#333' : 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {showDebugUVs ? 'Hide UV Debug' : 'Show UV Debug'}
            </button>
            {outlines.length > 0 && (
              <button
                onClick={clearOutlines}
                style={{ padding: '8px 16px', borderRadius: '4px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Clear Outlines
              </button>
            )}
            {currentOutline && currentOutline.length > 2 && (
              <button
                onClick={saveOutline}
                style={{ padding: '8px 16px', borderRadius: '4px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Save Outline
              </button>
            )}
            {outlines.length > 0 && (
              <button
                onClick={saveShapesToJSON}
                style={{ padding: '8px 16px', borderRadius: '4px', background: '#9C27B0', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Export JSON
              </button>
            )}
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={loadShapesFromJSON}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => jsonInputRef.current?.click()}
              style={{ padding: '8px 16px', borderRadius: '4px', background: '#FF9800', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Import JSON
            </button>
            <span style={{ fontSize: '12px', color: '#888' }}>
              Scroll to zoom • Alt+drag or middle-click to pan • Click & drag for free draw • Click near start point to close outline
            </span>
          </>
        )}
      </div>

      <div 
        ref={containerRef}
        style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <canvas 
          ref={canvasRef}
          style={{ 
            width: '100%', 
            height: '100%', 
            cursor: isDrawing ? 'crosshair' : isPanning ? 'grab' : 'default', 
            background: '#000',
            display: 'block'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
        {!uploadedImage && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>Select a Panorama</div>
            <div style={{ fontSize: '14px', color: '#888' }}>Use the dropdown above to select a 360° panorama</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanoramaEditor2D;
