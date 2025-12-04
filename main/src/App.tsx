import "./styles/App.css";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import Button from "./components/Button";
import ColorPicker from "./components/ColorPicker";
import { useState } from "react";

type Tool = "pen" | "eraser" | "bucket";

function App() {
  // Initialize based on screen size
  const getInitialCanvasSize = () => {
    const width = window.innerWidth;
    if (width < 640) return 400; // mobile
    if (width < 1024) return 600; // tablet
    return 800; // desktop
  };

  const [showGrid, setShowGrid] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [selectedTool, setSelectedTool] = useState<Tool>("pen");
  const [canvasSize, setCanvasSize] = useState(getInitialCanvasSize());
  // Pixel size is 1/40th of canvas size (400->10, 600->15, 800->20, 1000->25)
  const pixelSize = canvasSize / 40;
  const [triggerSave, setTriggerSave] = useState(0);
  const [triggerLoad, setTriggerLoad] = useState(0);
  const [triggerReset, setTriggerReset] = useState(0);
  const [triggerUndo, setTriggerUndo] = useState(0);
  const [triggerRedo, setTriggerRedo] = useState(0);

  const handleResetCanvas = () => {
    if (
      confirm(
        "Are you sure you want to reset the canvas? This will clear all your work."
      )
    ) {
      setTriggerReset((prev) => prev + 1);
    }
  };

  const handleCanvasSize = () => {
    const sizes = [400, 600, 800, 1000];
    const currentIndex = sizes.indexOf(canvasSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const newSize = sizes[nextIndex];

    if (
      confirm(
        `Change canvas size to ${newSize}x${newSize}? This will reset the canvas.`
      )
    ) {
      setCanvasSize(newSize);
      setTriggerReset((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen select-none">
      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8 flex-1">
        {/* match header container width */}
        <Header />
        {/* Top tools */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 py-2">
          <Button
            onClick={() => setSelectedTool("pen")}
            className={selectedTool === "pen" ? "bg-white! text-black!" : ""}
          >
            Pen
          </Button>
          <Button
            onClick={() => setSelectedTool("eraser")}
            className={selectedTool === "eraser" ? "bg-white! text-black!" : ""}
          >
            Eraser
          </Button>
          <Button
            onClick={() => setSelectedTool("bucket")}
            className={selectedTool === "bucket" ? "bg-white! text-black!" : ""}
          >
            Bucket
          </Button>
          <ColorPicker
            color={penColor}
            onChange={setPenColor}
            label="Pen Color"
          />
          <ColorPicker
            color={canvasColor}
            onChange={setCanvasColor}
            label="Canvas Color"
          />
        </div>

        {/* Canvas + side buttons */}
        <div className="w-full flex justify-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6">
            <Button
              className="self-center justify-self-center"
              onClick={() => setTriggerUndo((prev) => prev + 1)}
            >
              Undo
            </Button>
            <Canvas
              showGrid={showGrid}
              penColor={penColor}
              canvasColor={canvasColor}
              selectedTool={selectedTool}
              canvasSize={canvasSize}
              pixelSize={pixelSize}
              triggerSave={triggerSave}
              triggerLoad={triggerLoad}
              triggerReset={triggerReset}
              triggerUndo={triggerUndo}
              triggerRedo={triggerRedo}
            />
            <Button
              className="self-center justify-self-center"
              onClick={() => setTriggerRedo((prev) => prev + 1)}
            >
              Redo
            </Button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="w-full flex justify-center">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 p-3">
            <Button onClick={() => setTriggerSave((prev) => prev + 1)}>
              Save
            </Button>
            <Button onClick={() => setTriggerLoad((prev) => prev + 1)}>
              Load
            </Button>
            <Button onClick={handleCanvasSize}>
              Canvas-Size ({canvasSize})
            </Button>
            <Button onClick={() => setShowGrid(!showGrid)}>Line-Toggle</Button>
            <Button onClick={handleResetCanvas}>Reset-Canvas</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
