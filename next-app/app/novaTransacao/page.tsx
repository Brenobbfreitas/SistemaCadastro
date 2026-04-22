"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createTransaction } from "@/app/actions/transactionActions";
import { getWallets } from "@/app/actions/walletActions";

export default function NovaTransacaoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const router = useRouter();

  // Quando a página carrega, vai buscar as carteiras do utilizador
  useEffect(() => {
    async function loadWallets() {
      const data = await getWallets();
      setWallets(data);
    }
    loadWallets();
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await createTransaction(formData);

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Transação registada com sucesso!");
      router.push("/home");
      router.refresh();
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Nova Transação</h1>
          <p className="text-gray-400 text-sm">
            Regista uma nova entrada ou saída de dinheiro.
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Descrição (Ex: Conta de Luz, Salário)" 
            name="description" 
            type="text" 
            required 
            disabled={isLoading} 
          />
          
          <Input 
            label="Valor (R$)" 
            name="amount" 
            type="number" 
            step="0.01" 
            placeholder="0.00"
            required 
            disabled={isLoading} 
          />

          {/* Campo de Seleção: Tipo de Transação */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Tipo de Movimentação</label>
            <select 
              name="type" 
              required
              disabled={isLoading}
              className="w-full bg-gray-950 border border-gray-800 text-white rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EXPENSE">Saída (Despesa) 🔴</option>
              <option value="INCOME">Entrada (Receita) 🟢</option>
            </select>
          </div>

          {/* Campo de Seleção: Escolher a Carteira */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Em qual carteira?</label>
            <select 
              name="walletId" 
              required
              disabled={isLoading || wallets.length === 0}
              className="w-full bg-gray-950 border border-gray-800 text-white rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {wallets.length === 0 ? (
                <option value="">A carregar carteiras...</option>
              ) : (
                wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} (Saldo: R$ {Number(wallet.balance).toFixed(2)})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Button type="submit" isLoading={isLoading} variant="primary">
              Registar Transação
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