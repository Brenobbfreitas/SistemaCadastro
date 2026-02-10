'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hash } from "bcryptjs";
import { auth, signOut } from "@/auth";

// Schema de validação
const UserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
});

export async function getUsers() {
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
    // Retorna o primeiro erro de validação encontrado
    return { error: validation.error.issues[0].message };
  }

  const { name, email, password } = validation.data;
  
  if (!password) return { error: "Senha é obrigatória" };
  
  const passwordHash = await hash(password, 12);

  try {
    await prisma.user.create({
      data: { name, email, password: passwordHash }
    });
  } catch (error) {
    // Verifica se é erro de unicidade (P2002 no Prisma é Unique Constraint)
    if ((error as any).code === 'P2002') {
      return { error: "Este e-mail já está cadastrado." };
    }
    console.error(error);
    return { error: "Erro genérico ao salvar usuário." };
  }

  // ✅ SUCESSO: Revalida e Redireciona
  // Como o redirect lança um erro interno do Next.js, nada abaixo dele é executado.
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

  if (!id) return;

  await prisma.user.delete({
    where: { id: parseInt(id) }
  });

  if (session?.user?.id === id) {
    await signOut({ redirectTo: "/login" });
  }

  revalidatePath("/home");
}