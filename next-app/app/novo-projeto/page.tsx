"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createProject } from "@/app/actions/projectActions";
import { getClients } from "@/app/actions/clientActions";
import { ArrowLeft, UserPlus, UserCheck, FileText, User, DollarSign, Activity } from "lucide-react";

export default function NovoProjetoPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const router = useRouter();

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
      toast.success("Projeto registado com sucesso!");
      router.push("/home");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar o projeto.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center pt-4 sm:pt-12">
      <section className="w-full max-w-4xl p-4 sm:p-0">
        
        {/* HEADER PADRONIZADO */}
        <div className="flex items-end justify-between mb-8 px-2">
          <div className="text-left">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-sky-500 font-bold">CRM Módulo</p>
            <h1 className="text-xl sm:text-2xl font-semibold mt-1">
              {step === 1 ? "Novo Projeto" : "Detalhes do Projeto"}
            </h1>
          </div>

          <button 
            onClick={() => step === 2 ? setStep(1) : router.back()}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors pb-1"
          >
            <span className="text-xs sm:text-sm font-medium">Voltar</span>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform rotate-180 sm:rotate-0" />
          </button>
        </div>

        {/* PASSO 1: A PERGUNTA INTELIGENTE */}
        {step === 1 && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-semibold mb-2 text-white">Para quem é este projeto?</h2>
            <p className="text-gray-400 mb-10 text-sm">Escolha se deseja vincular a um cliente existente ou cadastrar um novo.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Opção A: Novo Cliente */}
              <button 
                onClick={() => router.push("/novo-cliente")}
                className="flex flex-col items-center justify-center gap-4 p-8 rounded-[1.5rem] border-2 border-dashed border-sky-500/40 bg-sky-900/10 hover:bg-sky-900/20 hover:border-sky-400 transition-all group"
              >
                <div className="h-16 w-16 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-sky-100 text-lg">Novo Cliente</h3>
                  <p className="text-xs text-sky-400/80 mt-1">Vou cadastrar alguém agora</p>
                </div>
              </button>

              {/* Opção B: Cliente Existente */}
              <button 
                onClick={() => setStep(2)}
                disabled={clients.length === 0}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[1.5rem] border transition-all group
                  ${clients.length === 0 
                    ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed' 
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/60'}`}
              >
                <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-transform
                  ${clients.length === 0 ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 text-gray-300 group-hover:scale-110'}`}>
                  <UserCheck size={28} />
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${clients.length === 0 ? 'text-gray-500' : 'text-gray-200'}`}>
                    Cliente Existente
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {clients.length === 0 ? "Nenhum cliente cadastrado" : "Já tenho o cliente salvo"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* PASSO 2: O FORMULÁRIO DE PROJETO */}
        {step === 2 && (
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-8 duration-300">
            <form action={handleSubmit} className="p-6 sm:p-10 space-y-8">
              
              <div className="space-y-6">
                {/* Título do Projeto */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                    <FileText size={14} className="text-sky-500" /> Título do Projeto / Serviço
                  </label>
                  <input 
                    type="text" 
                    name="title" 
                    placeholder="Ex: Desenvolvimento de E-commerce ou Tráfego Pago"
                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-gray-600 text-sm sm:text-base"
                    required 
                    disabled={isLoading} 
                  />
                </div>

                {/* Selecionar Cliente */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                    <User size={14} className="text-sky-500" /> Cliente Vinculado
                  </label>
                  <select 
                    name="clientId"
                    required
                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-gray-200 text-sm sm:text-base appearance-none cursor-pointer"
                    disabled={isLoading}
                  >
                    <option value="" className="bg-gray-900 text-gray-500">-- Escolha o Cliente --</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id} className="bg-gray-900">{client.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {/* Valor Total */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                      <DollarSign size={14} className="text-emerald-500" /> Valor Total (R$)
                    </label>
                    <input 
                      type="number" 
                      name="totalValue" 
                      step="0.01"
                      placeholder="0.00"
                      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600 text-sm sm:text-base"
                      required 
                      disabled={isLoading} 
                    />
                  </div>
                  
                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                      <Activity size={14} className="text-sky-500" /> Status Atual
                    </label>
                    <select 
                      name="status"
                      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-gray-200 text-sm sm:text-base appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="PROSPECT" className="bg-gray-900">Orçamento / Prospecção</option>
                      <option value="ACTIVE" className="bg-gray-900">Em Andamento (Ativo)</option>
                      <option value="COMPLETED" className="bg-gray-900">Concluído</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rodapé do Formulário */}
              <div className="pt-6 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-xs text-gray-500 max-w-xs text-center sm:text-left">
                  Este projeto será usado para separar as finanças da empresa dos seus gastos pessoais.
                </p>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-12 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-sky-900/20 text-sm sm:text-base"
                >
                  {isLoading ? "Processando..." : "Criar Projeto"}
                </button>
              </div>
            </form>
          </div>
        )}

        <footer className="mt-12 mb-8 text-center">
          <p className="text-gray-700 text-[10px] font-medium tracking-widest uppercase">
            SysManager • Gestão de Contratos
          </p>
        </footer>
      </section>
    </main>
  );
}