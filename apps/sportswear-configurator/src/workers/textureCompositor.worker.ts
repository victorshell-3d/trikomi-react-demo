export interface WorkerMessageInit {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
}

export interface WorkerMessageRender {
  type: 'render';
  svgString: string;
  // TODO: Add logos and seam layers later
}

type WorkerMessage = WorkerMessageInit | WorkerMessageRender;

let offscreenCanvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let canvasWidth = 2048;
let canvasHeight = 2048;

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  if (msg.type === 'init') {
    offscreenCanvas = msg.canvas;
    ctx = offscreenCanvas.getContext('2d');
    canvasWidth = msg.width;
    canvasHeight = msg.height;
    // Tell main thread we are ready
    self.postMessage({ type: 'ready' });
  } 
  else if (msg.type === 'render') {
    if (!ctx || !offscreenCanvas) return;

    // Convert SVG string to a Blob URL
    const blob = new Blob([msg.svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
      // Use ImageBitmap which is supported in Web Workers
      // Note: fetching the blob URL and creating an ImageBitmap is the correct way
      // to render an SVG to canvas in a worker. Wait! Fetching SVG blob URL into ImageBitmap 
      // is tricky. Some browsers (Safari/Firefox) have issues with SVG ImageBitmaps.
      // Let's use fetch -> blob -> createImageBitmap
      const response = await fetch(url);
      const svgBlob = await response.blob();
      const imageBitmap = await createImageBitmap(svgBlob);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(imageBitmap, 0, 0, canvasWidth, canvasHeight);

      imageBitmap.close();
      
      // Tell main thread the render is complete so it can update the texture
      self.postMessage({ type: 'rendered' });
    } catch (err) {
      console.error('Worker render error:', err);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
};
