'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

const ClientSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  phone: z.string().optional()
});

export async function createClient(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  };

  const validation = ClientSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const { name, email, phone } = validation.data;

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Utilizador não encontrado." };

    await prisma.client.create({
      data: { name, email: email || null, phone: phone || null, userId: dbUser.id }
    });

    revalidatePath('/home');
    return { success: true };
  } catch (error) {
    return { error: "Erro interno ao criar o cliente." };
  }
}

export async function getClients() {
  const session = await auth();
  if (!session?.user?.email) return [];

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return [];

    return await prisma.client.findMany({
      where: { userId: dbUser.id },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    return [];
  }
}