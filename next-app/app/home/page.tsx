import UserList from '@/components/UserList';
import { getUsers } from '@/app/actions/userActions'; 
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link"; // Adicionei para ter um botão de "Novo Usuário" se quiser

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const users = await getUsers();

  return (
    <main className="min-h-screen p-10 bg-gray-900 flex flex-col items-center">
      {/* Cabeçalho do Painel */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Painel de Controle</h1>
          <p className="text-gray-400 text-sm">Visão Geral do Sistema</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block text-gray-200 font-medium">{session.user?.name}</span>
            <span className="text-xs text-gray-500">{session.user?.email}</span>
          </div>
          
          {/* Botão para ir para a tela de cadastro, caso queira adicionar alguém por aqui */}
          <Link 
            href="/cadastro"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
          >
            + Novo Usuário
          </Link>
        </div>
      </div>
      
      
      {/* Lista de Usuários */}
      <div className="w-full max-w-4xl bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl text-white mb-6 border-l-4 border-blue-500 pl-3 font-semibold">
          Usuários Cadastrados
        </h2>
        <UserList users={users} /> 
      </div>
    </main>
  )
}