import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getWallets } from '../actions/walletActions'
import { getRecentTransactions } from '../actions/transactionActions';
import { getRecentProjects } from '../actions/projectActions';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();
  
  // 1. Proteção de Rota
  if (!session) {
    redirect("/login");
  }

  // 2. Busca as carteiras e transações
  const wallets = await getWallets();
  const transactions = await getRecentTransactions();
  const projects = await getRecentProjects();

  // Função auxiliar para formatar dinheiro (BRL)
  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
  };

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gray-950 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Cabeçalho do Painel */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Meu Painel</h1>
            <p className="text-gray-400 text-sm">Gestão Financeira & Negócios</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="block text-gray-200 font-medium">{session.user?.name}</span>
              <span className="text-xs text-gray-500">{session.user?.email}</span>
            </div>
            
            <Link 
              href="/nova-carteira" 
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition font-medium"
            >
              + Nova Carteira
            </Link>
          </div>
        </div>
        
        {/* Seção 1: Minhas Carteiras (Saldos) */}
        <div className="mb-10">
          <h2 className="text-xl text-white mb-6 border-l-4 border-green-500 pl-3 font-semibold">
            Meus Saldos
          </h2>
          
          {wallets.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center shadow-lg">
              <p className="text-gray-400 mb-4">Ainda não tens nenhuma carteira criada.</p>
              <Link href="/nova-carteira" className="text-green-500 hover:text-green-400 font-medium underline transition-colors">
                Cria a tua primeira carteira (Ex: Conta Pessoal ou Conta Empresa)
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg hover:border-gray-700 transition">
                  <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">
                    {wallet.name}
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(wallet.balance)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção 2: Transações e CRM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* BLOCO DE TRANSAÇÕES ATUALIZADO */}
           <div className="bg-gray-900/40 p-6 rounded-lg border border-gray-800 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg text-white border-l-4 border-blue-500 pl-3 font-semibold">
                  Últimas Transações
                </h2>
                <Link href="/nova-transacao" className="text-sm bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-3 rounded transition-colors font-medium">
                  + Nova
                </Link>
              </div>

              {transactions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-sm italic">Nenhuma movimentação registada.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {transactions.map((tx: any) => (
                    <div key={tx.id} className="flex justify-between items-center bg-gray-950 p-3 rounded-lg border border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm">{tx.description}</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {tx.wallet.name} • {new Date(tx.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <span className={`font-bold text-sm ${tx.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
           </div>
           
           {/* BLOCO CRM ATUALIZADO */}
           <div className="bg-gray-900/40 p-6 rounded-lg border border-gray-800 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg text-white border-l-4 border-purple-500 pl-3 font-semibold">
                  Projetos Ativos (CRM)
                </h2>
                <Link href="/novo-projeto" className="text-sm bg-purple-600 hover:bg-purple-500 text-white py-1.5 px-3 rounded transition-colors font-medium">
                  + Novo
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-sm italic">Nenhum projeto ativo.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {projects.map((project: any) => (
                    <div key={project.id} className="flex justify-between items-center bg-gray-950 p-3 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm">{project.title}</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {project.client?.name} • 
                          <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                            ${project.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' : 
                              project.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 
                              'bg-gray-700 text-gray-300'}`}
                          >
                            {project.status === 'ACTIVE' ? 'Ativo' : project.status === 'COMPLETED' ? 'Concluído' : 'Orçamento'}
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-sm text-purple-400">
                          {formatCurrency(project.totalValue)}
                        </span>
                        {project.dueDate && (
                          <span className="text-[10px] text-gray-500 mt-1">
                            Prazo: {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

      </div>
    </main>
  );
}