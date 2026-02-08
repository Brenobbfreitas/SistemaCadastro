'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hash } from "bcryptjs";
import { auth, signOut } from "@/auth";

// Schema de validação (Zod)
const UserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(), // Opcional na edição
});

export async function getUsers() {
  // Adicionei try/catch para evitar crash se o banco cair
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

export async function addUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validation = UserSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: "Dados inválidos" };
  }

  const { name, email, password } = validation.data;
  
  // Hash da senha é obrigatório na criação
  if (!password) return { error: "Senha é obrigatória" };
  const passwordHash = await hash(password, 12);

  try {
    await prisma.user.create({
      data: { name, email, password: passwordHash }
    });
  } catch (error) {
    return { error: "Erro ao criar usuário (Email já existe?)" };
  }

  revalidatePath('/');
  redirect('/login');
}

export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (id && name && email) {
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });
    revalidatePath('/');
  }
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string;
  const session = await auth();

  // 1. Apaga do banco
  await prisma.user.delete({
    where: { id: parseInt(id) }
  });

  // 2. Verifica se o usuário apagou a si mesmo
  if (session?.user?.id === id) {
    await signOut({ redirectTo: "/login" });
  }

  revalidatePath("/home");
}