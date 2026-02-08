import UserForm from '@/components/UserForm';
import UserList from '@/components/UserList';
import { getUsers } from './actions/userActions';

// Garante que a página sempre busque dados novos
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Buscamos os usuários no servidor
  const users = await getUsers();

  return (
    <main className="min-h-screen p-10 bg-gray-900 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Sistema de Usuários</h1>
      
      <UserForm />
      
      <div className="mt-10 w-full max-w-4xl">
        <UserList users={users} /> 
      </div>
    </main>
  )
}