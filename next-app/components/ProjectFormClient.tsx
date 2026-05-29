'use client'

import { useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { createProject } from "@/app/actions/projectActions";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Client {
  id: number;
  name: string;
  company: string | null;
}

export default function ProjectFormClient({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"select-type" | "form">("select-type");
  
  // Estado para controlar se o projeto é para um cliente novo ou existente
  const [clientType, setClientType] = useState<"new" | "existing" | null>(null);

  const handleSelectType = (type: "new" | "existing") => {
    setClientType(type);
    if (type === "existing") {
      setStep("form");
    } else {
      // Se for cliente novo, redirecionamos para o fluxo de cadastro de cliente
      router.push("/clientes/novo");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createProject(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Projeto criado com sucesso!");
      router.push("/projetos");
      router.refresh();
    }
  };

  // PASSO 1: Tela de escolha do tipo de vínculo de cliente
  if (step === "select-type") {
    return (
      <div className="text-center py-6 max-w-xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white">Para quem é este projeto?</h2>
          <p className="text-gray-400 text-sm mt-1">Escolha se deseja vincular a um cliente existente ou cadastrar um novo.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opção: Novo Cliente */}
          <button
            onClick={() => handleSelectType("new")}
            className="flex flex-col items-center gap-4 bg-gray-900/40 hover:bg-gray-900/80 border border-gray-800 hover:border-sky-500/50 p-6 rounded-2xl transition-all group text-left w-full"
          >
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl group-hover:scale-110 transition-transform">
              <UserPlus size={24} />
            </div>
            <div>
              <div className="font-semibold text-white text-base">Novo Cliente</div>
              <div className="text-xs text-gray-400 mt-1">Vou cadastrar alguém agora</div>
            </div>
          </button>

          {/* Opção: Cliente Existente */}
          <button
            onClick={() => handleSelectType("existing")}
            className="flex flex-col items-center gap-4 bg-gray-900/40 hover:bg-gray-900/80 border border-gray-800 hover:border-purple-500/50 p-6 rounded-2xl transition-all group text-left w-full"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <UserCheck size={24} />
            </div>
            <div>
              <div className="font-semibold text-white text-base">Cliente Existente</div>
              <div className="text-xs text-gray-400 mt-1">Já tenho o cliente salvo</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // PASSO 2: Formulário de dados do projeto propriamente dito
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
      <Input 
        label="Título do Projeto / Serviço" 
        name="title" 
        type="text" 
        placeholder="Ex: Desenvolvimento de Site, Identidade Visual..." 
        required 
      />

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-gray-400">Cliente Vinculado</label>
        <select
          name="clientId"
          required
          className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-purple-500 outline-none text-sm transition-all"
        >
          <option value="">Selecione um cliente da lista...</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} {client.company ? `(${client.company})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input 
          label="Valor Total (R$)" 
          name="totalValue" 
          type="text" 
          placeholder="1500,00" 
          required 
        />

        <Input 
          label="Data de Entrega (Prazo)" 
          name="dueDate" 
          type="date" 
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-gray-400">Descrição / Notas do Escopo</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Detalhes adicionais sobre entregáveis, reuniões ou contrato..."
          className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-purple-500 outline-none text-sm resize-none transition-all"
        />
      </div>

      <div className="flex gap-3 mt-4 border-t border-gray-800 pt-4">
        <button
          type="button"
          onClick={() => setStep("select-type")}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide transition-colors"
        >
          Alterar Cliente
        </button>
        <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700" isLoading={loading}>
          Criar Projeto
        </Button>
      </div>

    </form>
  );
}