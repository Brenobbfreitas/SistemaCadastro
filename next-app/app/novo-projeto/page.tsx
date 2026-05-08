"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createProject } from "@/app/actions/projectActions";
import { getClients } from "@/app/actions/clientActions";

export default function NovoProjetoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const router = useRouter();

  // Carregar os clientes assim que a página abrir
  useEffect(() => {
    async function loadClients() {
      const data = await getClients();
      setClients(data);
    }
    loadClients();
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      const result = await createProject(formData);

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Projeto/Orçamento registado!");
      router.push("/home");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar o projeto.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-lg bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Novo Projeto</h1>
          <p className="text-gray-400 text-sm">Crie um orçamento ou um projeto ativo.</p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-5">
          
          <Input 
            label="Título do Projeto" 
            name="title" 
            placeholder="Ex: Desenvolvimento de Site E-commerce"
            required 
            disabled={isLoading} 
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Selecionar Cliente</label>
            <select 
              name="clientId"
              required
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">-- Escolha o Cliente --</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="text-xs text-amber-500 mt-1">
                ⚠️ Nenhum cliente encontrado. <Link href="/novo-cliente" className="underline">Cadastra um aqui primeiro.</Link>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Valor Total (R$)" 
              name="totalValue" 
              type="number" 
              step="0.01"
              placeholder="0,00"
              required 
              disabled={isLoading} 
            />
            
            <Input 
              label="Prazo de Entrega" 
              name="dueDate" 
              type="date" 
              disabled={isLoading} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Status Inicial</label>
            <select 
              name="status"
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="PROSPECT">Orçamento / Prospecção</option>
              <option value="ACTIVE">Em Andamento (Ativo)</option>
              <option value="COMPLETED">Concluído</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Descrição / Notas</label>
            <textarea 
              name="description"
              rows={3}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md p-2.5"
              placeholder="Detalhes sobre o que foi combinado..."
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Button type="submit" isLoading={isLoading} variant="primary">
              Criar Projeto
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