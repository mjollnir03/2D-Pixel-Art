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
          <div className="flex flex-wrap justify-center items-center p-2 gap-4">
            {/* Tool Buttons */}
            <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
              Pen
            </button>
            <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
              Eraser
            </button>
            <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
              Bucket
            </button>
            <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
              Canvas-Color
            </button>
            <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
              Pen-Color
            </button>
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
