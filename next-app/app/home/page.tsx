import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getWallets } from '../actions/walletActions'
import { getRecentTransactions } from '../actions/transactionActions';
import { getRecentProjects } from '../actions/projectActions';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  Activity, 
  FolderKanban,
  ArrowRight
} from "lucide-react"; // Importando os ícones premium!

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
    <main className="min-h-screen p-4 sm:p-8 lg:p-12 bg-gray-950 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        
        {/* CABEÇALHO PADRONIZADO (Estilo UI Moderno) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-gray-800/50 pb-8">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-sky-500 font-bold">SysManager</p>
            <h1 className="text-3xl font-semibold mt-1 text-white">Visão Geral</h1>
          </div>
          
          <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
            <div className="text-left md:text-right flex items-center gap-3">
              {/* Avatar Simples (Opcional, dá um toque premium) */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-900/20">
                {session.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <span className="block text-gray-200 font-medium text-sm">{session.user?.name}</span>
                <span className="text-xs text-gray-500">{session.user?.email}</span>
              </div>
            </div>
            
            <Link 
              href="/nova-carteira" 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-5 py-2.5 rounded-2xl transition-all font-medium shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Nova Carteira</span>
            </Link>
          </div>
        </div>
        
        {/* SEÇÃO 1: CARTEIRAS (SALDOS EM BENTO BOX) */}
        <div className="mb-12">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-2 ml-1">
            <Wallet size={16} className="text-emerald-500" /> Meus Saldos
          </h2>
          
          {wallets.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-dashed border-gray-700/50 rounded-[2rem] p-10 text-center shadow-xl">
              <div className="h-16 w-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <Wallet size={24} />
              </div>
              <p className="text-gray-400 mb-4 text-sm">Ainda não tens nenhuma carteira configurada.</p>
              <Link href="/nova-carteira" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors flex items-center justify-center gap-1">
                Criar a primeira carteira <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-[2rem] p-6 shadow-xl overflow-hidden hover:border-emerald-500/30 transition-all">
                  {/* Efeito de brilho no fundo do card */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider flex items-center justify-between">
                      {wallet.name}
                      <Activity size={14} className="text-emerald-500/50" />
                    </h3>
                    <p className="text-3xl font-semibold text-white tracking-tight">
                      {formatCurrency(wallet.balance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEÇÃO 2: GRID DUPLO (TRANSAÇÕES VS CRM) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* BLOCO DE TRANSAÇÕES */}
           <div className="bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] border border-gray-800/50 shadow-xl flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Activity size={16} className="text-sky-500" /> Últimas Transações
                </h2>
                <Link href="/nova-transacao" className="text-xs bg-gray-800 hover:bg-sky-600 text-gray-300 hover:text-white py-2 px-4 rounded-xl transition-all font-medium flex items-center gap-1">
                  <Plus size={14} /> Lançar
                </Link>
              </div>

              {transactions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 py-10">
                  <Activity size={32} className="text-gray-600 mb-3" />
                  <p className="text-gray-500 text-sm">Nenhuma movimentação recente.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 relative z-10">
                  {transactions.map((tx: any) => (
                    <div key={tx.id} className="group flex justify-between items-center bg-gray-800/20 hover:bg-gray-800/40 p-4 rounded-2xl border border-transparent hover:border-gray-700/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${tx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {tx.type === 'INCOME' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-medium text-sm">{tx.description}</span>
                          <span className="text-[11px] text-gray-500 mt-0.5">
                            {tx.wallet.name} • {new Date(tx.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
           </div>
           
           {/* BLOCO DE CRM (PROJETOS) */}
           <div className="bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] border border-gray-800/50 shadow-xl flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <FolderKanban size={16} className="text-purple-500" /> Projetos (CRM)
                </h2>
                <Link href="/novo-projeto" className="text-xs bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white py-2 px-4 rounded-xl transition-all font-medium flex items-center gap-1">
                  <Plus size={14} /> Novo
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 py-10">
                  <Briefcase size={32} className="text-gray-600 mb-3" />
                  <p className="text-gray-500 text-sm">Nenhum projeto ativo.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 relative z-10">
                  {projects.map((project: any) => (
                    <div key={project.id} className="group flex justify-between items-center bg-gray-800/20 hover:bg-gray-800/40 p-4 rounded-2xl border border-transparent hover:border-purple-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                          <Briefcase size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-medium text-sm">{project.title}</span>
                          <span className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                            {project.client?.name}
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                              ${project.status === 'ACTIVE' ? 'bg-sky-500/20 text-sky-400' : 
                                project.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 
                                'bg-gray-700/50 text-gray-400'}`}
                            >
                              {project.status === 'ACTIVE' ? 'Ativo' : project.status === 'COMPLETED' ? 'Concluído' : 'Orçamento'}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-sm text-gray-300 group-hover:text-white transition-colors">
                          {formatCurrency(project.totalValue)}
                        </span>
                        {project.dueDate && (
                          <span className="text-[10px] text-gray-500 mt-0.5">
                            Até {new Date(project.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

        </div>

        <footer className="mt-16 text-center">
          <p className="text-gray-700 text-[10px] font-medium tracking-widest uppercase">
            SysManager • Gestão Inteligente
          </p>
        </footer>

      </div>
    </main>
  );
}