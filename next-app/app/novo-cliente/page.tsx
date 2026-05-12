"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/app/actions/clientActions";
import { ArrowLeft, UserPlus, Mail, Phone, Briefcase, MessageSquare } from "lucide-react";

export default function NovoClientePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await createClient(formData);
      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }
      toast.success("Cliente cadastrado com sucesso!");
      router.back(); 
    } catch (error) {
      toast.error("Erro ao salvar o cliente.");
      setIsLoading(false);
    }
  }

  return (
    // bg-gray-950 garante que não haja "quebra" visual com a Navbar escura
    // pt-4 no mobile e pt-12 no desktop para um respiro elegante
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center pt-4 sm:pt-12">
      
      {/* Container Principal Responsivo */}
      <section className="w-full max-w-4xl p-4 sm:p-0">
        
        {/* HEADER INVERTIDO: Título à Esquerda | Botão à Direita */}
        <div className="flex items-end justify-between mb-8 px-2">
          {/* Lado Esquerdo: Identificação do Módulo */}
          <div className="text-left">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-sky-500 font-bold">CRM Módulo</p>
            <h1 className="text-xl sm:text-2xl font-semibold mt-1">Cadastro de Cliente</h1>
          </div>

          {/* Lado Direito: Ação de Voltar */}
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors pb-1"
          >
            <span className="text-xs sm:text-sm font-medium">Voltar</span>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform rotate-180 sm:rotate-0" />
          </button>
        </div>

        {/* Card Principal - Estilo "Bento Box" moderno com bordas suaves */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <form action={onSubmit} className="p-6 sm:p-10 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Campo Nome */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                  <UserPlus size={14} className="text-sky-500" /> Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: João Silva ou Nexus Ltda"
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-gray-600 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                  <Mail size={14} className="text-sky-500" /> E-mail de Contato
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="exemplo@email.com"
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-gray-600 text-sm sm:text-base"
                />
              </div>

              {/* Campo Telefone */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                  <Phone size={14} className="text-sky-500" /> Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(00) 0 0000-0000"
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-gray-600 text-sm sm:text-base"
                />
              </div>

              {/* Campo Empresa/Cargo */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                  <Briefcase size={14} className="text-sky-500" /> Empresa / Cargo
                </label>
                <input
                  type="text"
                  name="cargo"
                  placeholder="Ex: Diretor Comercial"
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-gray-600 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Campo Observações */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-500 ml-1 flex items-center gap-2">
                <MessageSquare size={14} className="text-sky-500" /> Observações Adicionais
              </label>
              <textarea
                name="mensagem"
                placeholder="Detalhes importantes sobre este cliente..."
                className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl px-5 py-4 min-h-[120px] outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-gray-600 resize-none text-sm sm:text-base"
              />
            </div>

            {/* Rodapé do Formulário */}
            <div className="pt-6 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-xs text-gray-500 max-w-xs text-center sm:text-left">
                Verifique os dados. O cadastro de clientes é essencial para o fluxo de projetos.
              </p>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-12 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-sky-900/20 text-sm sm:text-base"
              >
                {isLoading ? "Salvando..." : "Finalizar Cadastro"}
              </button>
            </div>
          </form>
        </div>
        
        <footer className="mt-12 mb-8 text-center">
          <p className="text-gray-700 text-[10px] font-medium tracking-widest uppercase">
            SysManager • Powered by Next.js 16
          </p>
        </footer>
      </section>
    </main>
  );
}