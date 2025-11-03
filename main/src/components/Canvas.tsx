import { useEffect, useRef, useState } from "react";

type CanvasProps = {
  showGrid?: boolean;
};

export default function Canvas({ showGrid }: CanvasProps) {
  // const { innerWidth, innerHeight } = window;
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pixelSize, setPixelSize] = useState(20); // Size of each pixel (adjustable)
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution 
    canvas.width = 800;
    canvas.height = 800;

    // Disable smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  }, [pixelSize, showGrid]); // Added showGrid to dependencies

  const drawPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
    const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;

    ctx.fillStyle = "black"; // Change to desired color
    ctx.fillRect(x, y, pixelSize, pixelSize);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <canvas
        ref={canvasRef}
        className="bg-white shadow-md border border-gray-400 cursor-crosshair"
        onMouseDown={(e) => {
          setIsDrawing(true);
          drawPixel(e);
        }}
        onMouseMove={(e) => {
          if (isDrawing) drawPixel(e);
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      />
    </div>
  );
}
