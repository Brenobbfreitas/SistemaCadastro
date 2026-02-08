'use client'

import { addUser } from "@/app/actions/userActions"; // Importamos DIRETO aqui
import { useState } from "react";

export default function UserForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            await addUser(formData);
        } catch (error) {
            alert("Erro ao salvar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-10 border border-gray-700">
            <h2 className="text-xl mb-4 font-semibold text-gray-100">Novo Usuário</h2>
            <form action={handleSubmit} className="flex flex-col gap-4">
                <input name="name" type="text" placeholder="Nome" required className="p-2 rounded bg-gray-700 text-white border border-gray-600" />
                <input name="email" type="email" placeholder="E-mail" required className="p-2 rounded bg-gray-700 text-white border border-gray-600" />
                <input name="password" type="password" placeholder="Senha" required className="p-2 rounded bg-gray-700 text-white border border-gray-600" />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
        </div>
    )
}