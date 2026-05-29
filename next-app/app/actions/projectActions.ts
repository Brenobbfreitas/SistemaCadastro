'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// ==========================================
// SCHEMAS DE VALIDAÇÃO (ZOD)
// ==========================================

// Schema para criação de projetos
const ProjectSchema = z.object({
  title: z.string().min(3, "O título do projeto é obrigatório"),
  description: z.string().nullable().optional().transform(v => v || ''),
  status: z.enum(['PROSPECT', 'ACTIVE', 'COMPLETED', 'CANCELED']).default('PROSPECT'),
  totalValue: z.preprocess((val) => {
    if (typeof val === 'string') {
      return Number(val.replace(',', '.').trim());
    }
    return Number(val);
  }, z.number().min(0, "O valor não pode ser negativo")),
  dueDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  clientId: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return Number(val);
  }, z.number({ required_error: "Tens de selecionar um cliente" }).min(1, "Tens de selecionar um cliente"))
});

// NOVO SCHEMA: Para atualização de projetos (Garante o ID numérico)
const UpdateProjectSchema = z.object({
  id: z.coerce.number().min(1, "ID inválido"),
  title: z.string().min(3, "O título do projeto é obrigatório"),
  description: z.string().nullable().optional().transform(v => v || ''),
  status: z.enum(['PROSPECT', 'ACTIVE', 'COMPLETED', 'CANCELED']),
  totalValue: z.preprocess((val) => {
    if (typeof val === 'string') return Number(val.replace(',', '.').trim());
    return Number(val);
  }, z.number().min(0, "O valor não pode ser negativo")),
});

// ==========================================
// SERVER ACTIONS (CRUD DE PROJETOS)
// ==========================================

// Criar novo projeto 
export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status') || 'PROSPECT',
    totalValue: formData.get('totalValue'),
    dueDate: formData.get('dueDate'),
    clientId: formData.get('clientId'), 
  };

  const validation = ProjectSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const { title, description, status, totalValue, dueDate, clientId } = validation.data;

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Utilizador não encontrado." };

    await prisma.project.create({
      data: {
        title, 
        description: description || null, 
        status, 
        totalValue, 
        dueDate: dueDate || null, 
        clientId, 
        userId: dbUser.id
      }
    });

    revalidatePath('/home');
    revalidatePath('/projetos'); // Revalida a nova listagem
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar projeto:", error); 
    return { error: "Erro interno ao criar o projeto." };
  }
}

// Buscar projetos recentes 
export async function getRecentProjects() {
  const session = await auth();
  if (!session?.user?.email) return [];

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return [];

    const projects = await prisma.project.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { client: true }
    });

    return projects.map(p => ({ ...p, totalValue: Number(p.totalValue) }));
  } catch (error) {
    return [];
  }
}

// NOVA FUNÇÃO: Atualizar dados do projeto (Executada pelo Modal)
export async function updateProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const rawData = {
    id: formData.get('id'),
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    totalValue: formData.get('totalValue'),
  };

  const validation = UpdateProjectSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const { id, title, description, status, totalValue } = validation.data;

  try {
    await prisma.project.update({
      where: { id },
      data: { 
        title, 
        description: description || null, 
        status, 
        totalValue 
      }
    });

    revalidatePath('/projetos');
    revalidatePath('/home');
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    return { error: "Erro ao atualizar projeto." };
  }
}

// NOVA FUNÇÃO EXPORTADA: Excluir projeto do banco
export async function deleteProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const id = formData.get('id');
  if (!id) return { error: "ID inválido" };

  try {
    // Executa a remoção física no banco de dados via Prisma
    await prisma.project.delete({ 
      where: { id: Number(id) } 
    });
    
    // Atualiza o estado das telas instantaneamente
    revalidatePath('/projetos');
    revalidatePath('/home');
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover projeto:", error);
    return { error: "Erro ao remover o projeto." };
  }
}