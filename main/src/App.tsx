import "./styles/App.css";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import Button from "./components/Button";
import { useState } from "react";

function App() {
  const [showGrid, setShowGrid] = useState(false);

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
          <Button>Canvas-Color</Button>
          <Button>Pen-Color</Button>
        </div>

        {/* Canvas + side buttons */}
        <div className="w-full flex justify-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6">
            <Button className="self-center justify-self-center">Undo</Button>
            <Canvas showGrid={showGrid} />
            <Button className="self-center justify-self-center">Redo</Button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="w-full flex justify-center">
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 p-3">
            <Button>Save</Button>
            <Button>Load</Button>
            <Button>Canvas-Size</Button>
            <Button onClick={() => setShowGrid(!showGrid)}>Line-Toggle</Button>
            <Button>Reset-Canvas</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
