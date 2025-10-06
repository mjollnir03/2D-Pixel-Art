export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-white/10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8">
        <h1 className="py-4 sm:py-6 md:py-8 text-center font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
          2D-Pixel-Art
        </h1>
      </div>
    </header>
  );
}
