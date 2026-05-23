import { useCallback, useEffect, useRef, useState } from "react";

type Tool = "pen" | "eraser" | "bucket";

type CanvasProps = {
  showGrid?: boolean;
  penColor?: string;
  canvasColor?: string;
  selectedTool?: Tool;
  canvasSize?: number;
  pixelSize?: number;
  triggerSave?: number;
  triggerLoad?: number;
  triggerReset?: number;
  triggerUndo?: number;
  triggerRedo?: number;
};

export default function Canvas({
  showGrid,
  penColor = "#000000",
  canvasColor = "#ffffff",
  selectedTool = "pen",
  canvasSize = 800,
  pixelSize = 20,
  triggerSave = 0,
  triggerLoad = 0,
  triggerReset = 0,
  triggerUndo = 0,
  triggerRedo = 0,
}: CanvasProps) {
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasColorRef = useRef(canvasColor);
  const previousCanvasColorRef = useRef(canvasColor);
  const lastUndoTriggerRef = useRef(triggerUndo);
  const lastRedoTriggerRef = useRef(triggerRedo);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= 50 ? 49 : newIndex;
    });
  }, [historyIndex]);

  useEffect(() => {
    canvasColorRef.current = canvasColor;
  }, [canvasColor]);

  // Initialize draw canvas
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.imageSmoothingEnabled = false;

    // Fill background
    const currentCanvasColor = canvasColorRef.current;
    ctx.fillStyle = currentCanvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state and update previous color
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);
    previousCanvasColorRef.current = currentCanvasColor;
  }, [triggerReset, canvasSize]);

  // Grid setup
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showGrid) {
      ctx.strokeStyle = "#888888";
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
  }, [showGrid, pixelSize, canvasSize]);

  // Update canvas background color when it changes
  useEffect(() => {
    const previousCanvasColor = previousCanvasColorRef.current;
    if (previousCanvasColor === canvasColor) return;

    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Get current canvas data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert previous and new colors from hex to RGB
    const oldR = parseInt(previousCanvasColor.slice(1, 3), 16);
    const oldG = parseInt(previousCanvasColor.slice(3, 5), 16);
    const oldB = parseInt(previousCanvasColor.slice(5, 7), 16);

    const newR = parseInt(canvasColor.slice(1, 3), 16);
    const newG = parseInt(canvasColor.slice(3, 5), 16);
    const newB = parseInt(canvasColor.slice(5, 7), 16);

    // Replace all pixels that match the old canvas color with the new color
    for (let i = 0; i < data.length; i += 4) {
      if (
        data[i] === oldR &&
        data[i + 1] === oldG &&
        data[i + 2] === oldB &&
        data[i + 3] === 255
      ) {
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    previousCanvasColorRef.current = canvasColor;
    saveToHistory();
  }, [canvasColor, saveToHistory]);

  // Save canvas as PNG
  useEffect(() => {
    if (triggerSave > 0) {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;

      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = data;
      link.download = `pixel-art.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [triggerSave]);

  // Load canvas from PNG
  useEffect(() => {
    if (triggerLoad > 0 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [triggerLoad]);

  // Undo functionality
  useEffect(() => {
    if (triggerUndo === lastUndoTriggerRef.current) return;
    lastUndoTriggerRef.current = triggerUndo;

    if (triggerUndo > 0 && historyIndex > 0) {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const newIndex = historyIndex - 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  }, [triggerUndo, historyIndex, history]);

  // Redo functionality
  useEffect(() => {
    if (triggerRedo === lastRedoTriggerRef.current) return;
    lastRedoTriggerRef.current = triggerRedo;

    if (triggerRedo > 0 && historyIndex < history.length - 1) {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  }, [triggerRedo, historyIndex, history]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png") {
      alert("Invalid file type. Please select a PNG image.");
      e.target.value = "";
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const canvas = drawCanvasRef.current;
      if (!canvas) {
        alert("Canvas not ready. Please try again.");
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        alert("Failed to load canvas context.");
        return;
      }

      // Check if image dimensions match canvas dimensions
      if (bitmap.width !== canvas.width || bitmap.height !== canvas.height) {
        const proceed = confirm(
          `Image dimensions (${bitmap.width}x${bitmap.height}) don't match canvas size (${canvas.width}x${canvas.height}).\n\nThe image will be stretched to fit. Continue?`
        );
        if (!proceed) {
          e.target.value = "";
          return;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      saveToHistory();
      e.target.value = "";
    } catch (error) {
      console.error("Failed to load image:", error);
      alert(
        "Failed to load the image. The file may be corrupted or incompatible."
      );
      e.target.value = "";
    }
  };

  const bucketFill = (startX: number, startY: number) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Get pixel coordinates
    const pixelX = Math.floor(startX / pixelSize) * pixelSize;
    const pixelY = Math.floor(startY / pixelSize) * pixelSize;

    // Get the color at the starting pixel
    const startIndex = (pixelY * canvas.width + pixelX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];
    const targetA = data[startIndex + 3];

    // Convert fill color from hex to RGB
    const fillColor = penColor;
    const r = parseInt(fillColor.slice(1, 3), 16);
    const g = parseInt(fillColor.slice(3, 5), 16);
    const b = parseInt(fillColor.slice(5, 7), 16);

    // Don't fill if the target color is the same as fill color
    if (targetR === r && targetG === g && targetB === b && targetA === 255) {
      return;
    }

    // Flood fill algorithm using a stack
    const stack: [number, number][] = [[pixelX, pixelY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

      visited.add(key);

      const index = (y * canvas.width + x) * 4;
      const currentR = data[index];
      const currentG = data[index + 1];
      const currentB = data[index + 2];
      const currentA = data[index + 3];

      // Check if this pixel matches the target color
      if (
        currentR !== targetR ||
        currentG !== targetG ||
        currentB !== targetB ||
        currentA !== targetA
      ) {
        continue;
      }

      // Fill the entire pixel block
      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          const fillIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
          data[fillIndex] = r;
          data[fillIndex + 1] = g;
          data[fillIndex + 2] = b;
          data[fillIndex + 3] = 255;
        }
      }

      // Add neighboring pixels to the stack
      stack.push([x + pixelSize, y]);
      stack.push([x - pixelSize, y]);
      stack.push([x, y + pixelSize]);
      stack.push([x, y - pixelSize]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x =
      Math.floor(((e.clientX - rect.left) * scaleX) / pixelSize) * pixelSize;
    const y =
      Math.floor(((e.clientY - rect.top) * scaleY) / pixelSize) * pixelSize;

    if (selectedTool === "pen") {
      ctx.fillStyle = penColor;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    } else if (selectedTool === "eraser") {
      ctx.fillStyle = canvasColor;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === "bucket") {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      bucketFill(x, y);
      saveToHistory();
    }
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
          onClick={handleCanvasClick}
          onMouseDown={(e) => {
            if (selectedTool !== "bucket") {
              setIsDrawing(true);
              drawPixel(e);
            }
          }}
          onMouseMove={(e) => {
            if (isDrawing && selectedTool !== "bucket") {
              drawPixel(e);
            }
          }}
          onMouseUp={() => {
            if (isDrawing) {
              setIsDrawing(false);
              saveToHistory();
            }
          }}
          onMouseLeave={() => {
            if (isDrawing) {
              setIsDrawing(false);
              saveToHistory();
            }
          }}
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
