"use client"
import { login } from "@/app/actions";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpa o erro da tela

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("E-mail ou senha inválidos");
        }else{
            window.location.href = "/home"
        }
    };
    return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-400 text-sm mb-1">E-mail</label>
        <input 
          name="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-green-500 outline-none"
          placeholder="seu@email.com"
          required 
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-1">Senha</label>
        <input 
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-green-500 outline-none"
          required 
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-4"
      >
        Entrar
      </button>

      <p className="text-gray-400 text-center mt-4">
        <Link href="/cadastro" className="text-green-500 hover:underline">
          Cadastre-se aqui
        </Link>
      </p>
    </form>
  );
}