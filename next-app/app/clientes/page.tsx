import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
// Importaremos um componente de lista com modal que vamos estruturar
import ClientListTable from "@/components/ClientListTable"; 

export default async function ClientesPage() {
  const session = await auth();
  
  // Busca os clientes vinculados ao utilizador logado
  const clients = await prisma.client.findMany({
    where: {
      user: { email: session?.user?.email || "" }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Meus Clientes</h1>
          <p className="text-gray-400 text-sm">Gerencie os dados e histórico dos seus clientes ativos.</p>
        </div>
        
        {/* Botão para ir para a página isolada de criação, se ele quiser criar um novo por aqui */}
        <Link 
          href="/clientes/novo" 
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-900/20"
        >
          <Plus size={16} /> Novo Cliente
        </Link>
      </div>

      {/* Componente Client Component que vai gerir a tabela e os Modais de Edição */}
      <ClientListTable initialClients={clients} />
    </div>
  );
}