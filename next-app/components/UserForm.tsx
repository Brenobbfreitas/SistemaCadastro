'use client'

import { addUser } from "@/app/actions/userActions";
import { useState } from "react";
import Link from "next/link"; 

export default function UserForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(""); 

        try {
            const result = await addUser(formData);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
            }
        } catch (err) {
            if ((err as Error).message === 'NEXT_REDIRECT') return; 
            console.error(err);
            setError("Erro inesperado. Tente novamente.");
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
            <h2 className="text-xl mb-4 font-semibold text-gray-100 text-center">Crie sua Conta</h2>
            
            <form action={handleSubmit} className="flex flex-col gap-4">
                {/* Inputs ... */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Nome</label>
                    <input name="name" type="text" placeholder="Seu nome completo" required className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-blue-500 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">E-mail</label>
                    <input name="email" type="email" placeholder="seu@email.com" required className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-blue-500 outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Senha</label>
                    <input name="password" type="password" placeholder="********" required className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-blue-500 outline-none transition-all" />
                </div>
                
                {/* Mensagem de Erro */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded text-center">
                        ⚠️ {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 flex justify-center uppercase text-sm tracking-wide"
                >
                    {loading ? "Criando conta..." : "Cadastrar"}
                </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-700 pt-4">
                <p className="text-sm text-gray-400">
                    Já possui uma conta?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors">
                        Faça Login aqui
                    </Link>
                </p>
            </div>
        </div>
    )
}