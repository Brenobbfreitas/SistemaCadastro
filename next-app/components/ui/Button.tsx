import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "danger" | "outline";
}

export function Button({ children, isLoading, variant = "primary", ...props }: ButtonProps) {
  const baseStyles = "font-medium rounded-md py-2.5 px-4 transition-colors flex items-center justify-center text-sm";
  
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-transparent border border-gray-600 hover:bg-gray-800 text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}