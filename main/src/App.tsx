import "./styles/App.css";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import Button from "./components/Button";
import ColorPicker from "./components/ColorPicker";
import { useState } from "react";

function App() {
  const [showGrid, setShowGrid] = useState(false);
  const [resetCanvas, setResetCanvas] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [canvasColor, setCanvasColor] = useState("#ffffff");
  const [saveCanvas, setSaveCanvas] = useState(false);
  const [loadCanvas, setLoadCanvas] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8 flex-1">
        {/* match header container width */}
        <Header />
        {/* Top tools */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 py-2">
          <Button>Pen</Button>
          <Button>Eraser</Button>
          <Button>Bucket</Button>
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
            <Button className="self-center justify-self-center">Undo</Button>
            <Canvas
              showGrid={showGrid}
              resetCanvas={resetCanvas}
              penColor={penColor}
              canvasColor={canvasColor}
              saveCanvas={saveCanvas}
              loadCanvas={loadCanvas}
            />
            <Button className="self-center justify-self-center">Redo</Button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="w-full flex justify-center">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 p-3">
            <Button onClick={() => setSaveCanvas(!saveCanvas)}>Save</Button>
            <Button onClick={() => setLoadCanvas(!loadCanvas)}>Load</Button>
            <Button>Canvas-Size</Button>
            <Button onClick={() => setShowGrid(!showGrid)}>Line-Toggle</Button>
            <Button onClick={() => setResetCanvas(!resetCanvas)}>
              Reset-Canvas
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
