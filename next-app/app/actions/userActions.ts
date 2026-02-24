'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hash } from "bcryptjs";
import { auth, signOut } from "@/auth";

// ==========================================
// SCHEMAS DE VALIDAÇÃO (ZOD)
// ==========================================

// 1. Schema para criar utilizador (A senha é obrigatória aqui)
const AddUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

// 2. Schema para atualizar utilizador (Não pedimos senha para editar perfil)
const UpdateUserSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido")
});

// ==========================================
// AÇÕES DE BASE DE DADOS (CRUD)
// ==========================================

export async function getUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error);
    return [];
  }
}

export async function addUser(formData: FormData) {
  // 1. Converte o FormData num objeto comum e valida com o Zod
  const rawData = Object.fromEntries(formData.entries());
  const validation = AddUserSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { name, email, password } = validation.data;
  
  // 2. Segurança: Encripta a palavra-passe antes de a guardar no banco (Salt de 12)
  const passwordHash = await hash(password, 12);

  try {
    // 3. Tenta criar o utilizador no banco
    await prisma.user.create({
      data: { name, email, password: passwordHash }
    });
  } catch (error: any) {
    // P2002 = Unique Constraint Violation (tentativa de inserir dado duplicado num campo único, como e-mail)
    if (error.code === 'P2002') {
      return { error: "Este e-mail já está registado no sistema." };
    }
    console.error("Erro ao criar utilizador:", error);
    return { error: "Erro interno. Tente novamente mais tarde." };
  }

  // 4. Limpa a cache da página inicial e redireciona (o redirect deve ficar sempre fora do try-catch)
  revalidatePath('/');
  redirect('/login');
}

export async function updateUser(formData: FormData) {
  // 1. Validação dos dados que chegam do Modal de Edição
  const rawData = Object.fromEntries(formData.entries());
  const validation = UpdateUserSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { id, name, email } = validation.data;
  const parsedId = parseInt(id, 10); // Converte o ID de string para número

  if (isNaN(parsedId)) return { error: "ID de utilizador inválido." };

  try {
    // 2. Atualiza os dados no banco
    await prisma.user.update({
      where: { id: parsedId },
      data: { name, email },
    });
    
    // 3. Atualiza os dados na tela em tempo real
    revalidatePath('/home');
    return { success: true };

  } catch (error: any) {
    // Protege contra a alteração para um e-mail que já pertence a outro utilizador
    if (error.code === 'P2002') {
      return { error: "Este e-mail já está em uso por outra conta." };
    }
    console.error("Erro ao atualizar utilizador:", error);
    return { error: "Erro ao guardar alterações." };
  }
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string;
  const parsedId = parseInt(id, 10);

  if (!id || isNaN(parsedId)) return { error: "ID inválido." };

  const session = await auth();

  try {
    // 1. Remove o utilizador do banco de dados
    await prisma.user.delete({
      where: { id: parsedId }
    });

    // 2. Segurança Extrema: Se o utilizador apagar a sua PRÓPRIA conta, a sua sessão é terminada instantaneamente
    if (session?.user?.id === id) {
      await signOut({ redirectTo: "/login" });
      return; 
    }

    revalidatePath("/home");
  } catch (error) {
    console.error("Erro ao apagar utilizador:", error);
    return { error: "Não foi possível eliminar este utilizador." };
  }
}