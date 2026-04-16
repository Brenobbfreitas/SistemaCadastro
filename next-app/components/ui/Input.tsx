import { InputHTMLAttributes } from "react";

// Estendemos os atributos normais de um input HTML para não perdermos o auto-complete do React
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // Opcional: Se passarmos um erro, a borda fica vermelha
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-400">{label}</label>
      
      <input
        {...props} // Injeta todos os atributos passados (name, type, onChange, etc)
        className={`p-3 rounded bg-gray-900 text-white border outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-red-500 focus:border-red-500" // Cor de erro
            : "border-gray-600 focus:border-blue-500" // Cor normal
        } ${props.className || ''}`} // Permite adicionar classes extra se necessário
      />
      
      {/* Se existir um erro, renderiza o texto em vermelho automaticamente */}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}