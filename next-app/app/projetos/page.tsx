import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProjectListTable from "@/components/ProjectListTable";

export default async function ProjetosPage() {
  const session = await auth();
  
  // Busca os projetos do utilizador logado e faz o "join" automático com os dados do cliente
  const projects = await prisma.project.findMany({
    where: {
      user: { email: session?.user?.email || "" }
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      client: true // Traz o nome, empresa, etc. do cliente vinculado ao projeto
    }
  });

  // Converte o campo totalValue (Decimal do Prisma) em número legível para o React
  const parsedProjects = projects.map(project => ({
    ...project,
    totalValue: Number(project.totalValue)
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Meus Projetos (CRM)</h1>
          <p className="text-gray-400 text-sm">Acompanhe o status, valores e prazos dos seus contratos.</p>
        </div>
        
        {/* Botão para a página separada de criação */}
        <Link 
          href="/projetos/novo" 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/20"
        >
          <Plus size={16} /> Novo Projeto
        </Link>
      </div>

      {/* TABELA DINÂMICA COM MODAL DE EDIÇÃO */}
      <ProjectListTable initialProjects={parsedProjects} />
      
    </div>
  );
}