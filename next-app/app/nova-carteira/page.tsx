"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createWallet } from "@/app/actions/walletActions";

export default function NovaCarteiraPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      // Chama a Server Action que criámos no backend
      const result = await createWallet(formData);

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Carteira criada com sucesso!");
      router.push("/home"); // Redireciona de volta para o Dashboard
      router.refresh(); // Força o Next.js a buscar os saldos atualizados
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Nova Carteira</h1>
          <p className="text-gray-400 text-sm">
            Cria uma nova conta para controlares os teus saldos (PF ou PJ).
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Nome da Carteira (Ex: Nubank PJ, Caixa Físico)" 
            name="name" 
            type="text" 
            required 
            disabled={isLoading} 
          />
          <Input 
            label="Saldo Inicial (R$)" 
            name="balance" 
            type="number" 
            step="0.01" 
            placeholder="0.00"
            required 
            disabled={isLoading} 
          />

          <div className="mt-4 flex flex-col gap-3">
            <Button type="submit" isLoading={isLoading} variant="primary">
              Criar Carteira
            </Button>
            
            <Link 
              href="/home" 
              className="text-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cancelar e voltar
            </Link>
          </div>
        </form>

      </div>
    </main>
  );
}