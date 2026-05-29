import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import ProjectFormClient from "@/components/ProjectFormClient"; // Vamos garantir o formulário isolado aqui

export default async function NovoProjetoPage() {
  const session = await auth();
  
  // Segurança de servidor complementar: se cair aqui sem sessão, manda para o login
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Busca a lista de clientes para alimentar o campo de seleção (Select) do formulário
  const clients = await prisma.client.findMany({
    where: {
      user: { email: session.user.email }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      
      {/* BOTÃO VOLTAR E TÍTULO */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Criar Novo Projeto</h1>
        
        <Link 
          href="/projetos" 
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Voltar para Lista
        </Link>
      </div>

      {/* CARD DO FORMULÁRIO */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shadow-xl">
        {/* Passamos os clientes vindos do banco diretamente para o formulário cliente gerir */}
        <ProjectFormClient clients={clients} />
      </div>

    </div>
  );
}