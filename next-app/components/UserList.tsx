'use client'

import {useState} from 'react'
import { deleteUser, updateUser } from '@/app/actions/userActions'
import { Trash2 } from 'lucide-react'

interface User { id: number; name: string | null; email: string | null; createdAt: Date }

export default function UserList({ users }: { users: User[] }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl mb-4 font-semibold text-gray-100 border-b border-gray-700 pb-2">Usuários ({users.length})</h2>
      {users.length === 0 ? <p className="text-gray-400 text-center mt-4">Nenhum usuário ainda.</p> : (
        <ul className="space-y-3 mt-4">
          {users.map((user) => (
            <li key={user.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
              <div><p className="font-bold text-white">{user.name}</p><p className="text-gray-400 text-sm">{user.email}</p></div>
              <form action={deleteUser}>
                <input type="hidden" name="id" value={user.id} />
                <button type="submit" className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors" title="Excluir"><Trash2 size={20} /></button>
              </form>
              <button
                onClick={() => {
                  setUserToEdit(user); 
                  setIsModalOpen(true); //abrir modal
                  }}
                    className="text-blue-500 hover:text-blue-400 p-2"
                  >
                  Editar
                </button>
            </li>
          ))}
        </ul>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Editar Usuário</h3>
            <form action={updateUser} onSubmit={() => setIsModalOpen(false)}>
              <input type="hidden" name="id" value={userToEdit?.id}/>
              
              <div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nome</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={userToEdit?.name || ''}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={userToEdit?.email || ''}
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Salvar Alterações
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
