// components/Canvas.tsx
export default function Canvas() {
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
