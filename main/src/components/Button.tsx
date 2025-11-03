import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Button({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
      "border-2 border-white bg-[#4a4a4a] text-white uppercase font-bold tracking-wide",
      "rounded-md shadow-md transition-colors duration-200",
      "hover:bg-white hover:text-black",
      "min-w-[7.5rem]",
      "py-0.5 px-1 md:py-0.5 md:px-2 xl:py-1 xl:px-3 2xl:py-1.5 2xl:px-4",
      "text-xs md:text-sm xl:text-base 2xl:text-lg",
      className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
