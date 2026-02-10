import UserForm from '@/components/UserForm';
import UserList from '@/components/UserList';
// ATENÇÃO: Ajuste o caminho da importação aqui se necessário
import { getUsers } from '@/app/actions/userActions'; 
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Proteção: Se não estiver logado, chuta para o login
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const users = await getUsers();

  return (
    <main className="min-h-screen p-10 bg-gray-900 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-400">Painel de Controle</h1>
        <span className="text-gray-400">Bem-vindo, {session.user?.name}</span>
      </div>
      
      {/* Se quiser esconder o formulário de cadastro aqui e deixar só no botão 'Cadastrar', pode remover essa linha depois */}
      <div className="mb-10">
          <h2 className="text-xl text-white mb-4 text-center">Cadastrar Novo Usuário</h2>
          <UserForm />
      </div>
      
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl text-white mb-4">Usuários Cadastrados</h2>
        <UserList users={users} /> 
      </div>
    </main>
  )
}