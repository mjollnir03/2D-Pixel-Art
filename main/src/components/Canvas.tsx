import { useEffect, useRef, useState } from "react";

type CanvasProps = {
  showGrid?: boolean;
  resetCanvas?: boolean;
  penColor?: string;
  canvasColor?: string;
  saveCanvas?: boolean;
  loadCanvas?: boolean;
};

export default function Canvas({
  showGrid,
  resetCanvas,
  penColor = "#000000",
  canvasColor = "#ffffff",
  saveCanvas = false,
  loadCanvas = false,
}: CanvasProps) {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pixelSize, setPixelSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  // Initialize draw canvas
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.imageSmoothingEnabled = false;

    // Fill background
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [resetCanvas, canvasColor]);

  // Grid setup
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showGrid) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 0.5;

      for (let x = 0; x <= canvas.width; x += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  }, [showGrid, pixelSize]);

  // Save canvas as PNG
  useEffect(() => {
    if (saveCanvas) {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;

      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = data;
      link.download = "canvas.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [saveCanvas]);

  // Load canvas from PNG
  useEffect(() => {
    if (loadCanvas && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [loadCanvas]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/png") {
      alert("Please select a PNG image.");
      return;
    }

    const bitmap = await createImageBitmap(file);
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw image on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // Reset input so the same file can be chosen again
    e.target.value = "";
  };

  const drawPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
    const y = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;

    ctx.fillStyle = penColor;
    ctx.fillRect(x, y, pixelSize, pixelSize);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative inline-block">
        {/* Hidden file input for loading PNG */}
        <input
          type="file"
          accept="image/png"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Drawing canvas */}
        <canvas
          ref={drawCanvasRef}
          className="cursor-crosshair"
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

        {/* Grid overlay */}
        <canvas
          ref={gridCanvasRef}
          className="absolute top-0 left-0 cursor-crosshair pointer-events-none"
        />
      </div>
    </div>
  );
}
