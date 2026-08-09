import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={[
        "min-w-[7.5rem] rounded-md border-2 border-white bg-[#4a4a4a] text-white",
        "font-bold uppercase tracking-wide shadow-md transition-colors duration-200",
        "px-1 py-0.5 md:px-2 md:py-0.5 xl:px-3 xl:py-1 2xl:px-4 2xl:py-1.5",
        "text-xs md:text-sm xl:text-base 2xl:text-lg",
        "hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        "disabled:cursor-not-allowed disabled:border-white/40 disabled:opacity-40 disabled:hover:bg-[#4a4a4a] disabled:hover:text-white",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
