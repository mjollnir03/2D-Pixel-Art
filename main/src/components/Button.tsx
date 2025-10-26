import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="border-2 border-white px-4 py-3 text-lg uppercase transition-colors duration-200 bg-[#4a4a4a] text-white hover:bg-white hover:text-black">
      {children}
    </button>
  );
}
