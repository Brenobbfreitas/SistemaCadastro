'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

const ProjectSchema = z.object({
  title: z.string().min(3, "O título do projeto é obrigatório"),
  description: z.string().optional(),
  status: z.enum(['PROSPECT', 'ACTIVE', 'COMPLETED', 'CANCELED']).default('PROSPECT'),
  totalValue: z.coerce.number().min(0, "O valor não pode ser negativo"),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : null), 
  clientId: z.coerce.number().min(1, "Tens de selecionar um cliente")
});

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
        title, description: description || null, status, totalValue, dueDate, clientId, userId: dbUser.id
      }
    });

    revalidatePath('/home');
    return { success: true };
  } catch (error) {
    return { error: "Erro interno ao criar o projeto." };
  }
}

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

    // Resolvemos o problema do Decimal aqui também!
    return projects.map(p => ({ ...p, totalValue: Number(p.totalValue) }));
  } catch (error) {
    return [];
  }
}