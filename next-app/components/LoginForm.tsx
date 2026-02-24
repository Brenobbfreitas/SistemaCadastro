'use client' // Indica ao Next.js que este componente usa interatividade no navegador (hooks, eventos)

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
    const router = useRouter();
    
    // ==========================================
    // ESTADOS GERAIS DO FORMULÁRIO
    // ==========================================
    const [error, setError] = useState(""); // Guarda mensagens de erro de login falhado
    const [loading, setLoading] = useState(false); // Desativa o botão enquanto processa o login
    
    // ==========================================
    // ESTADOS DE VALIDAÇÃO DO E-MAIL
    // ==========================================
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    /**
     * Valida se o formato do e-mail inserido está correto.
     * Atualiza o estado de erro visualmente para dar feedback imediato ao utilizador.
     */
    const validateEmail = (value: string) => {
        // Regra (Regex): Tem de ter texto, seguido de '@', seguido de texto, um ponto '.', e mais texto
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        
        if (!value) {
            setEmailError("O e-mail é obrigatório.");
            return false;
        } else if (!emailRegex.test(value)) {
            setEmailError("Formato inválido. Ex: nome@email.com");
            return false;
        } else {
            setEmailError(""); // Limpa o erro se o formato for válido
            return true;
        }
    };

    /**
     * Interceta a digitação do utilizador no campo de e-mail.
     * Permite validar o formato em tempo real (a cada letra digitada).
     */
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value); 
    };

    /**
     * Processa a submissão do formulário.
     * Faz a validação final e comunica com o sistema de autenticação (NextAuth).
     */
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Evita o recarregamento padrão da página ao enviar o formulário
        setError(""); // Limpa erros de tentativas anteriores

        // 1. Barreira de segurança: Impede o envio se o e-mail estiver mal formatado
        const isEmailValid = validateEmail(email);
        if (!isEmailValid) return; 

        setLoading(true);

        // 2. Extração segura dos dados: Usa FormData em vez de 'any' para manter a tipagem forte do TypeScript
        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;

        // 3. Tentativa de Login: Chama o provider "credentials" configurado no auth.ts
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Mantém o utilizador nesta página se der erro, para mostrarmos a mensagem
        });

        // 4. Tratamento da Resposta
        if (result?.error) {
            setError("E-mail ou senha incorretos.");
            setLoading(false); // Liberta o botão para nova tentativa
        } else {
            // Login bem sucedido: Redireciona para o painel principal e atualiza os dados da sessão
            router.push("/home");
            router.refresh();
        }
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Entrar no Sistema</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* CAMPO DE E-MAIL */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">E-mail</label>
                    <input 
                        name="email" 
                        type="email" 
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="seu@email.com" 
                        // O Tailwind muda a borda para vermelho se existir um erro no estado 'emailError'
                        className={`p-3 rounded bg-gray-900 text-white border outline-none transition-all ${
                            emailError ? "border-red-500 focus:border-red-500" : "border-gray-600 focus:border-green-500"
                        }`}
                    />
                    {/* Feedback visual de erro do e-mail */}
                    {emailError && (
                        <span className="text-xs text-red-400">{emailError}</span>
                    )}
                </div>

                {/* CAMPO DE SENHA */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Senha</label>
                    <input 
                        name="password" 
                        type="password" 
                        required
                        placeholder="********" 
                        className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-green-500 outline-none transition-all"
                    />
                </div>

                {/* MENSAGEM DE ERRO GLOBAL (Credenciais inválidas) */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-200 text-sm p-3 rounded text-center">
                        ⚠️ {error}
                    </div>
                )}

                {/* BOTÃO DE SUBMISSÃO */}
                <button 
                    type="submit" 
                    // Desabilita o botão se estiver a carregar OU se o formato do e-mail estiver errado
                    disabled={loading || !!emailError} 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            {/* RODAPÉ */}
            <div className="mt-6 text-center border-t border-gray-700 pt-4">
                <Link href="/cadastro" className="text-green-400 hover:text-green-300 hover:underline text-sm font-semibold transition-colors">
                    Cadastre-se aqui
                </Link>
            </div>
        </div>
    );
}