'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Input } from "./ui/Input";   // <-- Importamos o nosso Input
import { Button } from "./ui/Button"; // <-- Importamos o nosso Botão

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            setEmailError("O e-mail é obrigatório.");
            return false;
        } else if (!emailRegex.test(value)) {
            setEmailError("Formato inválido. Ex: nome@email.com");
            return false;
        } else {
            setEmailError(""); 
            return true;
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value); 
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        if (!validateEmail(email)) return; 

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
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
                
                <Input 
                    label="E-mail"
                    name="email" 
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="seu@email.com" 
                    error={emailError} // Passamos o erro e o componente trata do design sozinho!
                />

                <Input 
                    label="Senha"
                    name="password" 
                    type="password" 
                    required
                    placeholder="********" 
                />

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-200 text-sm p-3 rounded text-center mt-2">
                        ⚠️ {error}
                    </div>
                )}

                {/* O BOTÃO TRATA DO LOADING */}
                <Button type="submit" variant="success" isLoading={loading} disabled={!!emailError}>
                    Entrar
                </Button>

            </form>

            <div className="mt-6 text-center border-t border-gray-700 pt-4">
                <Link href="/cadastro" className="text-green-400 hover:text-green-300 hover:underline text-sm font-semibold transition-colors">
                    Cadastre-se aqui
                </Link>
            </div>
        </div>
    );
}