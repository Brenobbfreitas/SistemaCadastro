'use client' // Necessário porque usamos hooks de estado (useState) para controlar o modal

import { useState } from 'react'
import { deleteUser, updateUser } from '@/app/actions/userActions'
import { Trash2, Edit } from 'lucide-react'

// Definição da interface (Tipagem) para garantir que o componente recebe os dados corretos
interface User { 
  id: number; 
  name: string | null; 
  email: string | null; 
  createdAt: Date 
}

export default function UserList({ users }: { users: User[] }) {
  // ==========================================
  // ESTADOS DO MODAL DE EDIÇÃO
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla se o modal está visível
  const [userToEdit, setUserToEdit] = useState<User | null>(null); // Guarda os dados do utilizador selecionado

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl mb-4 font-semibold text-gray-100 border-b border-gray-700 pb-2">
        Usuários ({users.length})
      </h2>
      
      {/* RENDERIZAÇÃO CONDICIONAL: Verifica se a lista de utilizadores está vazia */}
      {users.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">Nenhum usuário ainda.</p>
      ) : (
        <ul className="space-y-3 mt-4">
          
          {/* Loop: Cria um item de lista (li) para cada utilizador no array */}
          {users.map((user) => (
            <li key={user.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-gray-500 transition-colors">
              
              {/* Informações do Utilizador */}
              <div>
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              
              {/* ÁREA DE AÇÕES (Botões da direita) */}
              <div className="flex items-center gap-2">
                
                {/* BOTÃO EDITAR: Preenche o estado 'userToEdit' e abre o modal */}
                <button
                  onClick={() => {
                    setUserToEdit(user); 
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-full transition-colors flex items-center gap-1 text-sm"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>

                {/* FORMULÁRIO EXCLUIR: Chama diretamente a Server Action 'deleteUser' */}
                <form action={deleteUser}>
                  {/* Input oculto (hidden) envia o ID do utilizador para a função no servidor */}
                  <input type="hidden" name="id" value={user.id} />
                  <button type="submit" className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors" title="Excluir">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ==========================================
          MODAL DE EDIÇÃO SOBREPOSTO (Pop-up)
          ========================================== */}
      {/* Só renderiza o HTML do modal se o estado 'isModalOpen' for true */}
      {isModalOpen && (
        // Fundo escuro com desfoque (backdrop-blur)
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          
          {/* Caixa central do Modal */}
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl w-full max-w-md shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-white mb-4">Editar Usuário</h3>
            
            {/* O formulário aciona a Server Action 'updateUser' e depois fecha o modal localmente */}
            <form action={updateUser} onSubmit={() => setIsModalOpen(false)}>
              
              {/* O ID é obrigatório para a base de dados saber quem atualizar */}
              <input type="hidden" name="id" value={userToEdit?.id}/>
              
              <div className="space-y-3">
                {/* Input de Nome (Preenchido com o valor antigo como padrão) */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Nome</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={userToEdit?.name || ''}
                    className="w-full bg-gray-900 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Input de Email (Preenchido com o valor antigo como padrão) */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={userToEdit?.email || ''}
                    className="w-full bg-gray-900 text-white p-3 rounded border border-gray-600 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button" // type="button" impede que este botão envie o formulário
                  onClick={() => setIsModalOpen(false)} // Apenas fecha o modal
                  className="text-gray-400 hover:text-white px-4 py-2 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit" // Envia os dados atualizados para o servidor
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}