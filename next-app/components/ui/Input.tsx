import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:opacity-50"
        {...props}
      />
    </div>
  );
}