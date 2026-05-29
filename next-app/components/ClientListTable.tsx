'use client'

import { useState } from "react";
import { Edit2, Trash2, X, Phone, Mail, Building } from "lucide-react";
import { updateClient, deleteClient } from "@/app/actions/clientActions";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";

interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
}

export default function ClientListTable({ initialClients }: { initialClients: Client[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await updateClient(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Cliente atualizado com sucesso!");
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este cliente?")) return;

    const formData = new FormData();
    formData.append("id", id.toString());

    const result = await deleteClient(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Cliente removido!");
    }
  };

  if (initialClients.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
        Nenhum cliente cadastrado até o momento.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-900/30 border border-gray-800/60 rounded-2xl shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider bg-gray-900/50">
            <th className="py-4 px-6">Nome / Empresa</th>
            <th className="py-4 px-6">Contacto</th>
            <th className="py-4 px-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/40 text-sm text-gray-300">
          {initialClients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-900/20 transition-colors">
              <td className="py-4 px-6">
                <div className="font-semibold text-white text-base">{client.name}</div>
                {client.company && (
                  <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                    <Building size={12} className="text-sky-500" /> {client.company}
                  </div>
                )}
              </td>
              <td className="py-4 px-6 space-y-1">
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Mail size={13} className="text-purple-400" /> {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Phone size={13} className="text-green-400" /> {client.phone}
                  </div>
                )}
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(client)}
                    className="p-2 text-gray-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-xl transition-all"
                    title="Editar cliente"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Remover cliente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL DE EDIÇÃO */}
      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-gray-900/60 px-6 py-4 border-b border-gray-700/50">
              <h3 className="text-lg font-bold text-white">Editar Dados do Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-4">
              <input type="hidden" name="id" value={selectedClient.id} />
              
              <Input label="Nome Completo" name="name" defaultValue={selectedClient.name} required />
              <Input label="E-mail de Contato" name="email" type="email" defaultValue={selectedClient.email || ""} />
              <Input label="Telefone / WhatsApp" name="phone" defaultValue={selectedClient.phone || ""} />
              <Input label="Empresa / Cargo" name="company" defaultValue={selectedClient.company || ""} />
              
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-gray-400">Observações</label>
                <textarea
                  name="notes"
                  defaultValue={selectedClient.notes || ""}
                  rows={3}
                  className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm uppercase tracking-wide"
                >
                  Cancelar
                </button>
                <Button type="submit" variant="primary" isLoading={loading}>
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}