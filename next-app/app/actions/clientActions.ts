'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// =========================================================================
// SCHEMAS DE VALIDAÇÃO (ZOD)
// =========================================================================

// Schema original para criação
const ClientSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(), 
  notes: z.string().optional()    
});

// NOVO SCHEMA: Schema específico para atualização de dados
// Inclui o campo 'id' convertido (coercionado) para número, garantindo que o Prisma saiba quem editar
const UpdateClientSchema = z.object({
  id: z.coerce.number().min(1, "ID do cliente inválido"),
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(), 
  notes: z.string().optional()    
});

// =========================================================================
// SERVER ACTIONS (CRUD DE CLIENTES)
// =========================================================================

// Criando Cliente 
export async function createClient(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'), 
    notes: formData.get('notes'),     
  };

  const validation = ClientSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const { name, email, phone, company, notes } = validation.data;

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Utilizador não encontrado." };

    await prisma.client.create({
      data: { 
        name, 
        email: email || null, 
        phone: phone || null, 
        company: company || null, 
        notes: notes || null,     
        userId: dbUser.id 
      }
    });

    // Revalidações originais mais a nova rota principal de listagem
    revalidatePath('/home');
    revalidatePath('/novo-cliente'); 
    revalidatePath('/clientes'); // <-- Garante que a nova página de listagem atualize na hora
    
    return { success: true };
  } catch (error) {
    console.error(error); 
    return { error: "Erro interno ao criar o cliente." };
  }
}

// Filtra pelo utilizador logado (Tua função original intacta)
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

// NOVA FUNÇÃO: Atualizar dados de um cliente existente
export async function updateClient(formData: FormData) {
  // 1. Verificação de segurança de sessão no servidor
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  // 2. Extração dos dados enviados pelo formulário do Modal de Edição
  const rawData = {
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    notes: formData.get('notes'),
  };

  // 3. Validação dos dados contra o Schema de atualização (Zod)
  const validation = UpdateClientSchema.safeParse(rawData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const { id, name, email, phone, company, notes } = validation.data;

  try {
    // 4. Executa o comando UPDATE no banco de dados filtrando pelo ID único do cliente
    await prisma.client.update({
      where: { id },
      data: {
        name,
        email: email || null, // Se vier em branco, salva como nulo no Postgres
        phone: phone || null,
        company: company || null,
        notes: notes || null,
      }
    });

    // 5. Limpa a cache das páginas estratégicas para os dados novos aparecerem instantaneamente
    revalidatePath('/clientes');
    revalidatePath('/home');
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return { error: "Erro ao atualizar os dados do cliente." };
  }
}

// NOVA FUNÇÃO: Remover um cliente do banco de dados
export async function deleteClient(formData: FormData) {
  // 1. Verificação de segurança de sessão
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  // 2. Resgata o ID do cliente que veio através do clique no botão da tabela
  const id = formData.get('id');
  if (!id) return { error: "ID inválido" };

  try {
    // 3. Deleta o registro correspondente no banco
    await prisma.client.delete({
      where: { id: Number(id) }
    });

    // 4. Notifica o Next.js para renderizar as tabelas visuais sem o cliente excluído
    revalidatePath('/clientes');
    revalidatePath('/home');
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao apagar cliente:", error);
    // Proteção de Integridade Referencial: Impede bugs caso o cliente possua projetos associados
    return { error: "Não é possível eliminar um cliente que possui projetos ativos vinculados." };
  }
}