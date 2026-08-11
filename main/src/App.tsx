import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Canvas, {
  type CanvasHandle,
  type CanvasStatusTone,
} from "./components/Canvas";
import ColorPicker from "./components/ColorPicker";
import Header from "./components/Header";

type Tool = "pen" | "eraser" | "bucket";
type ConfirmationKind = "reset" | "import";

const EXPORT_SIZES = [400, 600, 800, 1000] as const;

function App() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [selectedTool, setSelectedTool] = useState<Tool>("pen");
  const [canvasSize, setCanvasSize] = useState<number>(800);
  const [confirmationKind, setConfirmationKind] =
    useState<ConfirmationKind | null>(null);
  const importConfirmationResolverRef = useRef<
    ((confirmed: boolean) => void) | null
  >(null);
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

  const settleImportConfirmation = useCallback((confirmed: boolean) => {
    const resolve = importConfirmationResolverRef.current;
    importConfirmationResolverRef.current = null;
    setConfirmationKind((current) => (current === "import" ? null : current));
    resolve?.(confirmed);
  }, []);

  const requestImportReplace = useCallback(() => {
    settleImportConfirmation(false);
    return new Promise<boolean>((resolve) => {
      importConfirmationResolverRef.current = resolve;
      setConfirmationKind("import");
    });
  }, [settleImportConfirmation]);

  useEffect(
    () => () => {
      importConfirmationResolverRef.current?.(false);
      importConfirmationResolverRef.current = null;
    },
    [],
  );

  const confirmCurrentAction = () => {
    if (confirmationKind === "import") {
      settleImportConfirmation(true);
      return;
    }

    canvasRef.current?.reset();
    setConfirmationKind(null);
  };

  const cancelCurrentAction = () => {
    if (confirmationKind === "import") {
      settleImportConfirmation(false);
      return;
    }

    setConfirmationKind(null);
  };

  const requestReset = () => {
    settleImportConfirmation(false);
    setConfirmationKind("reset");
  };

  const cycleCanvasSize = () => {
    setCanvasSize((current) => {
      const currentIndex = EXPORT_SIZES.findIndex((size) => size === current);
      return EXPORT_SIZES[(currentIndex + 1) % EXPORT_SIZES.length];
    });
  };

  return (
    <div className="flex min-h-screen select-none flex-col">
      {confirmationKind && (
        <div
          role="alert"
          style={{
            top: "max(1rem, calc(env(safe-area-inset-top) + 0.5rem))",
            left: "max(0.5rem, env(safe-area-inset-left))",
            right: "max(0.5rem, env(safe-area-inset-right))",
          }}
          className="fixed z-50 mx-auto max-h-[calc(100dvh-2rem)] max-w-md overflow-y-auto rounded-md border-2 border-white bg-[#2e2e2e] p-3 text-center text-white shadow-xl sm:p-4"
        >
          <p className="font-bold">
            {confirmationKind === "reset"
              ? "Reset the canvas?"
              : "Replace current artwork?"}
          </p>
          <p className="mt-1 text-sm">
            {confirmationKind === "reset"
              ? "This will clear your artwork. You can undo the reset afterward."
              : "Loading this PNG will replace the current artwork. You can still use Undo afterward."}
          </p>
          <div className="mt-3 flex flex-col items-center justify-center gap-2 min-[360px]:flex-row min-[360px]:gap-3">
            <Button onClick={confirmCurrentAction}>
              {confirmationKind === "reset" ? "Reset" : "Load PNG"}
            </Button>
            <Button onClick={cancelCurrentAction}>Cancel</Button>
          </div>
        </div>
      )}

      <main className="responsive-page-gutter mx-auto w-full max-w-screen-xl flex-1">
        <Header />

        <div className="responsive-control-row flex flex-wrap items-center justify-center py-2">
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

        <div className="flex w-full justify-center px-0 py-3 sm:p-4">
          <div className="editor-layout grid w-full grid-cols-2 items-center gap-4">
            <Button
              className="editor-undo order-2 self-center justify-self-end"
              onClick={() => canvasRef.current?.undo()}
              disabled={!historyState.canUndo}
            >
              Undo
            </Button>
            <div className="editor-canvas order-1 col-span-2 mx-auto w-full max-w-[75dvh]">
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
                onRequestImportReplace={requestImportReplace}
              />
            </div>
            <Button
              className="editor-redo order-3 self-center justify-self-start"
              onClick={() => canvasRef.current?.redo()}
              disabled={!historyState.canRedo}
            >
              Redo
            </Button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="responsive-control-row flex flex-wrap items-center justify-center p-3">
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
            <Button onClick={requestReset}>Reset-Canvas</Button>
          </div>
        </div>
      </main>

      <footer
        className="responsive-page-gutter w-full py-4 text-center text-sm text-white"
        style={{
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        Ellmaer Ranjber
      </footer>
    </div>
  );
}

export default App;
