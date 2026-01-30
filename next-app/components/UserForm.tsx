interface UserFormProps { saveAction: (formData: FormData) => Promise<void> }

export default function UserForm({ saveAction }: UserFormProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-10 border border-gray-700">
      <h2 className="text-xl mb-4 font-semibold text-gray-100">Novo Usuário</h2>
      <form action={saveAction} className="flex flex-col gap-4">
        <input 
        name="name" 
        type="text" 
        placeholder="Nome" 
        required 
        className="p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
        />
        <input 
        name="email" 
        type="email" 
        placeholder="E-mail" 
        required 
        className="p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400" 
        />
        <input 
        name="password" 
        type="password" 
        placeholder="Senha" 
        required 
        className="w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
         />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors">CADASTRAR</button>
      </form>
    </div>
  )
}
