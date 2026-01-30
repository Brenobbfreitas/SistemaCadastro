import { addUser } from './actions'
import UserForm from '@/components/UserForm'
export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main className="min-h-screen p-10 bg-gray-900 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Sistema de Usuários</h1>
      <UserForm saveAction={addUser} />
    </main>
  )
}
