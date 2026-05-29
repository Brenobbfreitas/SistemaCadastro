'use client'

import { useState } from "react";
import { Edit2, Trash2, X, Calendar, DollarSign, Tag } from "lucide-react";
import { updateProject, deleteProject } from "@/app/actions/projectActions";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";

interface Project {
  id: number;
  title: string;
  description: string | null;
  status: 'PROSPECT' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';
  totalValue: number;
  dueDate: Date | null;
  client?: { name: string; company: string | null } | null;
}

export default function ProjectListTable({ initialProjects }: { initialProjects: Project[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  // Tradução e mapeamento estético das Badges de Status
  const statusConfig = {
    PROSPECT: { label: "Orçamento", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    ACTIVE: { label: "Em Andamento", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    COMPLETED: { label: "Concluído", bg: "bg-green-500/10 text-green-400 border-green-500/20" },
    CANCELED: { label: "Cancelado", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await updateProject(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Projeto atualizado com sucesso!");
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este projeto?")) return;

    const formData = new FormData();
    formData.append("id", id.toString());

    const result = await deleteProject(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Projeto removido!");
    }
  };

  if (initialProjects.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
        Nenhum projeto registrado até o momento.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-900/30 border border-gray-800/60 rounded-2xl shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider bg-gray-900/50">
            <th className="py-4 px-6">Projeto / Cliente</th>
            <th className="py-4 px-6">Valor Contratual</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/40 text-sm text-gray-300">
          {initialProjects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-900/20 transition-colors">
              <td className="py-4 px-6">
                <div className="font-semibold text-white text-base tracking-tight">{project.title}</div>
                <div className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
                  <Tag size={12} className="text-purple-400" /> 
                  Cliente: <span className="text-gray-200 font-medium">{project.client?.name || 'Não informado'}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="text-white font-bold flex items-center gap-0.5 text-base">
                  <span className="text-xs text-gray-500 font-normal mr-1">R$</span>
                  {project.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </td>
              <td className="py-4 px-6">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig[project.status].bg}`}>
                  {statusConfig[project.status].label}
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL DE EDIÇÃO DE PROJETO */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-gray-900/60 px-6 py-4 border-b border-gray-700/50">
              <h3 className="text-lg font-bold text-white">Editar Detalhes do Projeto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-4">
              <input type="hidden" name="id" value={selectedProject.id} />
              
              <Input label="Título do Serviço" name="title" defaultValue={selectedProject.title} required />
              <Input label="Valor do Contrato (R$)" name="totalValue" defaultValue={selectedProject.totalValue.toString()} required />
              
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-gray-400">Status Atual do CRM</label>
                <select
                  name="status"
                  defaultValue={selectedProject.status}
                  className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-purple-500 outline-none text-sm"
                >
                  <option value="PROSPECT">Orçamento / Prospecção</option>
                  <option value="ACTIVE">Em Andamento / Ativo</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="CANCELED">Cancelado</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm text-gray-400">Descrição / Escopo do Projeto</label>
                <textarea
                  name="description"
                  defaultValue={selectedProject.description || ""}
                  rows={3}
                  className="p-3 rounded bg-gray-900 text-white border border-gray-600 focus:border-purple-500 outline-none text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl text-sm uppercase tracking-wide"
                >
                  Cancelar
                </button>
                <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700">
                  Salvar Projeto
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}