'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// ==========================================
// SCHEMAS DE VALIDAÇÃO (ZOD)
// ==========================================
const WalletSchema = z.object({
  name: z.string().min(2, "O nome da carteira deve ter no mínimo 2 caracteres"),
  balance: z.coerce.number().default(0), 
});

// ==========================================
// AÇÕES DE CARTEIRA (CRUD)
// ==========================================

// 1. Buscar todas as carteiras do utilizador logado
export async function getWallets() {
  const session = await auth();
  
  // Mudámos a validação para o EMAIL, que é garantido pelo NextAuth
  if (!session?.user?.email) {
    return []; // Em vez de quebrar a tela com throw Error, retornamos array vazio
  }

  try {
    // Busca o utilizador no banco para descobrir o ID real dele
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) return [];

    // Agora sim, busca as carteiras amarradas a este ID
    const wallets = await prisma.wallet.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'asc' }
    });
    
    return wallets;
  } catch (error) {
    console.error("Erro ao buscar carteiras:", error);
    return [];
  }
}

// 2. Criar uma nova carteira
export async function createWallet(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Precisas de iniciar sessão." };
  }

  const rawData = {
    name: formData.get('name'),
    balance: formData.get('balance') || 0,
  };

  const validation = WalletSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { name, balance } = validation.data;

  try {
    // Descobre o ID real do utilizador antes de salvar
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) return { error: "Utilizador não encontrado no banco de dados." };

    await prisma.wallet.create({
      data: {
        name,
        balance,
        userId: dbUser.id, 
      }
    });

    revalidatePath('/home');
    return { success: true };

  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Já tens uma carteira com este nome." };
    }
    console.error("Erro ao criar carteira:", error);
    return { error: "Erro interno ao criar carteira." };
  }
}