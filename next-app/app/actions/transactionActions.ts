'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// 1. Validador
const TransactionSchema = z.object({
  description: z.string().min(2, "A descrição é obrigatória"),
  amount: z.coerce.number().positive("O valor tem de ser maior que zero"),
  type: z.enum(['INCOME', 'EXPENSE']),
  walletId: z.coerce.number(),
});

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const rawData = {
    description: formData.get('description'),
    amount: formData.get('amount'),
    type: formData.get('type'),
    walletId: formData.get('walletId'),
  };

  const validation = TransactionSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  //  Extraímos os dados PRIMEIRO, antes de tentar usá-los
  const { description, amount, type, walletId } = validation.data;

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Utilizador não encontrado." };

    // 🛑 REGRA DE SEGURANÇA (Agora no lugar certo, dentro do try)
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) return { error: "Carteira não encontrada." };

    if (type === 'EXPENSE' && Number(wallet.balance) < amount) {
      return { error: `Saldo insuficiente! Tens apenas R$ ${Number(wallet.balance).toFixed(2)} nesta carteira.` };
    }
    // 🛑 FIM DA REGRA DE SEGURANÇA

    //  Categorias separadas para não dar conflito no Banco de Dados
    const categoryName = type === 'INCOME' ? 'Receitas Gerais' : 'Despesas Gerais';
    
    let defaultCategory = await prisma.category.findFirst({
      where: { userId: dbUser.id, name: categoryName }
    });

    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: { name: categoryName, type: type, userId: dbUser.id }
      });
    }

    // 🌟 Transação Atômica do Prisma
    await prisma.$transaction(async (tx) => {
      
      // 1. Regista a movimentação na tabela
      await tx.transaction.create({
        data: {
          description,
          amount,
          type,
          date: new Date(),
          walletId,
          categoryId: defaultCategory.id,
          userId: dbUser.id
        }
      });

      // 2. Atualiza o saldo
      if (type === 'INCOME') {
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: amount } } 
        });
      } else {
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { decrement: amount } } 
        });
      }
    });

    revalidatePath('/home');
    return { success: true };

  } catch (error) {
    console.error("Erro ao processar transação:", error);
    return { error: "Erro interno ao processar o dinheiro." };
  }


}

// ==========================================
// BUSCAR ÚLTIMAS TRANSAÇÕES
// ==========================================
export async function getRecentTransactions() {
  const session = await auth();
  if (!session?.user?.email) return [];

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return [];

    // Busca as últimas 5 transações deste utilizador
    const transactions = await prisma.transaction.findMany({
      where: { userId: dbUser.id },
      orderBy: { date: 'desc' }, // As mais recentes primeiro
      take: 5, // Limite de 5 para não encher o Dashboard
      include: {
        wallet: true, // Traz os dados da carteira junto
        category: true // Traz os dados da categoria junto
      }
    });

    return transactions;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
}