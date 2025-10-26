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
        "py-2 px-5",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
