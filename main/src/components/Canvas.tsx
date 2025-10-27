import { useRef } from "react";

export default function Canvas() {

  const {innerWidth, innerHeight} = window;

  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const ctx = canvasRef.current?.getContext('2d');

  return (
    <div className="flex justify-center items-center w-full">
      <canvas
        className="
          bg-white rounded-md shadow-md border border-gray-400
          w-[92vw] max-w-[800px] aspect-square
        "
      />
    </div>
  );
}
