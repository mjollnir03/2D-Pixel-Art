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
        <div className="flex-1">
          {/* Top tools */}
          <div className="flex flex-wrap justify-center items-center p-2 gap-4">
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

          {/* Canvas + side buttons aligned */}
          <div className="w-full flex justify-center p-4">
            <div className="grid grid-cols-[auto_auto_auto] items-center gap-6">
              <button
                type="button"
                className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black"
              >
                Undo
              </button>

              {/* Canvas sits in the middle column */}
              <div className="rounded-sm">
                <Canvas />
              </div>

              <button
                type="button"
                className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black"
              >
                Redo
              </button>
            </div>
          </div>

          {/* Bottom Row (styled to match) */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-4 p-3">
              <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
                Save
              </button>
              <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
                Load
              </button>
              <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
                Canvas-Size
              </button>
              <button className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
                Line-Toggle
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
