'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    // estados para validação de e-mail
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // Função que valida o formato do e-mail 
    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regra: texto + @ + texto + . + texto
        
        if (!value) {
            setEmailError("O e-mail é obrigatório.");
            return false;
        } else if (!emailRegex.test(value)) {
            setEmailError("Formato inválido. Ex: nome@email.com");
            return false;
        } else {
            setEmailError(""); // Limpa o erro se estiver certo
            return true;
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        // Valida a cada letra digitada (opcional: pode validar só no onBlur se preferir)
        validateEmail(value); 
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        // 1. Validação final antes de enviar
        const isEmailValid = validateEmail(email);
        if (!isEmailValid) return; // Para aqui se o e-mail estiver errado

        setLoading(true);

        const password = (e.target as any).password.value;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            // Aqui tratamos se o e-mail não existe no banco ou senha errada
            setError("E-mail ou senha incorretos.");
            setLoading(false);
        } else {
            router.push("/home");
            router.refresh();
        }
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Entrar no Sistema</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* CAMPO DE E-MAIL COM VALIDAÇÃO */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">E-mail</label>
                    <input 
                        name="email" 
                        type="email" 
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="seu@email.com" 
                        className={`p-3 rounded bg-gray-900 text-white border outline-none transition-all ${
                            emailError ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-green-500"
                        }`}
                    />
                    {/* Mensagem de erro pequena embaixo do input */}
                    {emailError && (
                        <span className="text-xs text-red-400">{emailError}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Senha</label>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="********" 
                        className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-green-500 outline-none transition-all"
                    />
                </div>

                {/* Erro Geral (Login falhou) */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-200 text-sm p-3 rounded text-center">
                        ⚠️ {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading || !!emailError} // Desabilita se tiver erro de e-mail
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-700 pt-4">
                <Link href="/cadastro" className="text-green-400 hover:text-green-300 hover:underline text-sm font-semibold">
                    Cadastre-se aqui
                </Link>
            </div>
        </div>
    );
}