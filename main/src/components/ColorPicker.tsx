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
  return (
    <label className="flex min-w-[7.5rem] cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-white bg-[#4a4a4a] px-1 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow-md transition-colors duration-200 hover:bg-white hover:text-black focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white md:px-2 md:py-0.5 md:text-sm xl:px-3 xl:py-1 xl:text-base 2xl:px-4 2xl:py-1.5 2xl:text-lg">
      <input
        type="color"
        value={color}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        className="h-5 w-5 cursor-pointer rounded border border-white bg-transparent p-0"
      />
      <span>{label}</span>
    </label>
  );
}
