import "./styles/App.css";
import Header from "./components/Header";
import Canvas from "./components/Canvas";

function App() {
  return (
    <>
      {/* Webpage */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div>
          <div className="flex justify-center items-center p-2 gap-2">
            {/* Top Row */}
            {/* Button should have gray background, white border, and white on hover and selected */}
            <button>Pen</button>
            <button>Eraser</button>
            <button>Bucket</button>
            <button>Canvas-Color</button>
            <button>Pen-Color</button>
          </div>

          {/* Undo Button */}
          {/* Canvas */}
          <Canvas />
          {/* Redo Button */}

          {/* Bottom Row */}
        </div>
      </div>
    </>
  );
}

export default App;
