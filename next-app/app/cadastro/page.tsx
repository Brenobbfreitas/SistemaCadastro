"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addUser } from "@/app/actions/userActions";

export default function CadastroPage() {
  const [isLoading, setIsLoading] = useState(false);

  // A função que estava a faltar / fora do sítio!
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await addUser(formData);

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }
      
      // O redirect para o login acontece dentro da server action em caso de sucesso
    } catch (error) {
      toast.error("Ocorreu um erro inesperado. Tenta novamente.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-gray-400 text-sm">
            Preenche os dados abaixo para criar conto no sistema.
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome Completo" name="name" type="text" required disabled={isLoading} />
          <Input label="E-mail" name="email" type="email" required disabled={isLoading} />
          <Input label="Palavra-passe" name="password" type="password" required disabled={isLoading} />
          <Input label="Confirmar Palavra-passe" name="confirmPassword" type="password" required disabled={isLoading} />

          <div className="mt-4">
            <Button type="submit" isLoading={isLoading} variant="primary">
              Cadastrar
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Já tens uma conta?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
            Inicia sessão aqui
          </Link>
        </p>
      </div>
    </main>
  );
}