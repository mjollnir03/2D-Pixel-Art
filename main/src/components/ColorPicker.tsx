import { ChromePicker } from "react-color";
import { useState, useRef, useEffect } from "react";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  label: string;
};

export default function ColorPicker({
  color,
  onChange,
  label,
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={[
          "border-2 border-white bg-[#4a4a4a] text-white uppercase font-bold tracking-wide",
          "rounded-md shadow-md transition-colors duration-200",
          "hover:bg-white hover:text-black",
          "min-w-[7.5rem]",
          "py-0.5 px-1 md:py-0.5 md:px-2 xl:py-1 xl:px-3 2xl:py-1.5 2xl:px-4",
          "text-xs md:text-sm xl:text-base 2xl:text-lg",
          "flex items-center justify-center gap-2",
        ].join(" ")}
      >
        <div
          className="w-5 h-5 rounded border border-white"
          style={{ backgroundColor: color }}
        />
        <span>{label}</span>
      </button>
      {showPicker && (
        <div className="absolute top-12 left-0 z-50">
          <ChromePicker color={color} onChange={(c) => onChange(c.hex)} />
        </div>
      )}
    </div>
  );
}
