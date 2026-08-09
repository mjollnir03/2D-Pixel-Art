import { useCallback, useRef, useState } from "react";
import Button from "./components/Button";
import Canvas, {
  type CanvasHandle,
  type CanvasStatusTone,
} from "./components/Canvas";
import ColorPicker from "./components/ColorPicker";
import Header from "./components/Header";

type Tool = "pen" | "eraser" | "bucket";

const EXPORT_SIZES = [400, 600, 800, 1000] as const;

function App() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [selectedTool, setSelectedTool] = useState<Tool>("pen");
  const [canvasSize, setCanvasSize] = useState<number>(800);
  const [showResetToast, setShowResetToast] = useState(false);
  const [historyState, setHistoryState] = useState({
    canUndo: false,
    canRedo: false,
  });

  const handleCanvasStatus = useCallback(
    (message: string, tone: CanvasStatusTone = "info") => {
      if (tone === "error") window.alert(message);
    },
    [],
  );

  const confirmReset = () => {
    canvasRef.current?.reset();
    setShowResetToast(false);
  };

  const cycleCanvasSize = () => {
    setCanvasSize((current) => {
      const currentIndex = EXPORT_SIZES.findIndex((size) => size === current);
      return EXPORT_SIZES[(currentIndex + 1) % EXPORT_SIZES.length];
    });
  };

  return (
    <div className="flex min-h-screen select-none flex-col">
      {showResetToast && (
        <div
          role="alert"
          className="fixed inset-x-4 top-4 z-50 mx-auto max-w-md rounded-md border-2 border-white bg-[#2e2e2e] p-4 text-center text-white shadow-xl"
        >
          <p className="font-bold">Reset the canvas?</p>
          <p className="mt-1 text-sm">
            This will clear your artwork. You can undo the reset afterward.
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <Button onClick={confirmReset}>Reset</Button>
            <Button onClick={() => setShowResetToast(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 sm:px-6 md:px-8">
        <Header />

        <div className="flex flex-wrap items-center justify-center gap-3 py-2 sm:gap-4 md:gap-6">
          <Button
            aria-pressed={selectedTool === "pen"}
            onClick={() => setSelectedTool("pen")}
            className={selectedTool === "pen" ? "bg-white! text-black!" : ""}
          >
            Pen
          </Button>
          <Button
            aria-pressed={selectedTool === "eraser"}
            onClick={() => setSelectedTool("eraser")}
            className={selectedTool === "eraser" ? "bg-white! text-black!" : ""}
          >
            Eraser
          </Button>
          <Button
            aria-pressed={selectedTool === "bucket"}
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

        <div className="flex w-full justify-center p-4">
          <div className="grid w-full grid-cols-1 items-center gap-4 md:grid-cols-[auto_minmax(0,800px)_auto] md:gap-6">
            <Button
              className="self-center justify-self-center"
              onClick={() => canvasRef.current?.undo()}
              disabled={!historyState.canUndo}
            >
              Undo
            </Button>
            <Canvas
              ref={canvasRef}
              showGrid={showGrid}
              penColor={penColor}
              canvasColor={canvasColor}
              selectedTool={selectedTool}
              canvasSize={canvasSize}
              onHistoryChange={setHistoryState}
              onCanvasColorRestore={setCanvasColor}
              onStatus={handleCanvasStatus}
            />
            <Button
              className="self-center justify-self-center"
              onClick={() => canvasRef.current?.redo()}
              disabled={!historyState.canRedo}
            >
              Redo
            </Button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex flex-wrap items-center justify-center gap-3 p-3 sm:gap-4 md:gap-6">
            <Button onClick={() => canvasRef.current?.save()}>Save</Button>
            <Button onClick={() => canvasRef.current?.openFilePicker()}>
              Load
            </Button>
            <Button
              onClick={cycleCanvasSize}
              aria-label={`Change PNG export size. Current size ${canvasSize} by ${canvasSize}`}
            >
              Canvas-Size ({canvasSize})
            </Button>
            <Button
              aria-pressed={showGrid}
              onClick={() => setShowGrid((current) => !current)}
            >
              Line-Toggle
            </Button>
            <Button onClick={() => setShowResetToast(true)}>Reset-Canvas</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
