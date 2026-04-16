import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "success" | "danger";
}

export function Button({ 
  children, 
  isLoading, 
  variant = "primary", // Azul por padrão
  ...props 
}: ButtonProps) {
  
  // Classes que todos os botões partilham
  const baseClasses = "text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center w-full uppercase text-sm tracking-wide mt-2";
  
  // Dicionário de cores
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-600 hover:bg-green-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseClasses} ${variants[variant]} ${props.className || ''}`}
    >
      {/* Se estiver a carregar, mostra o spinner, senão mostra o texto normal */}
      {isLoading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Aguarde...
        </span>
      ) : (
        children
      )}
    </button>
  );
}