import "./styles/App.css";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import Button from "./components/Button";

function App() {
  return (
    <>
      {/* Webpage */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-1">
          {/* Top tools */}
          <div className="flex flex-wrap justify-center items-center p-2 gap-4">
            <Button>Pen</Button>
            <Button>Eraser</Button>
            <Button>Bucket</Button>
            <Button>Canvas-Color</Button>
            <Button>Pen-Color</Button>
          </div>

          {/* Canvas + side buttons*/}
          <div className="w-full flex justify-center p-4">
            <div className="grid grid-cols-[auto_auto_auto] items-center gap-6">
              <Button>Undo</Button>

              {/* Canvas  */}
              <Canvas />

              <Button>Redo</Button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-4 p-3">
              <Button>Save</Button>
              <Button>Load</Button>
              <Button>Canvas-Size</Button>
              <Button>Line-Toggle</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
