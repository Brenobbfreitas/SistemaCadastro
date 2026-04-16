import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {getWallets} from '../actions/walletActions'

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();
  
  // 1. Proteção de Rota
  if (!session) {
    redirect("/login");
  }

  // 2. Busca as carteiras do banco de dados vinculadas APENAS a este usuário
  const wallets = await getWallets();

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
            
            {/* O botão agora aponta para criar uma nova carteira */}
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

        {/* Seção 2: Esqueleto para as próximas funcionalidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-gray-900/40 p-6 rounded-lg border border-gray-800 border-dashed min-h-[300px] flex flex-col">
              <h2 className="text-lg text-white mb-4 border-l-4 border-blue-500 pl-3 font-semibold">
                Últimas Transações
              </h2>
              <div className="flex-1 flex items-center justify-center">
                 <p className="text-gray-600 text-sm">Módulo em construção...</p>
              </div>
           </div>
           
           <div className="bg-gray-900/40 p-6 rounded-lg border border-gray-800 border-dashed min-h-[300px] flex flex-col">
              <h2 className="text-lg text-white mb-4 border-l-4 border-purple-500 pl-3 font-semibold">
                Projetos Ativos (CRM)
              </h2>
              <div className="flex-1 flex items-center justify-center">
                 <p className="text-gray-600 text-sm">Módulo em construção...</p>
              </div>
           </div>
        </div>

      </div>
    </main>
  );
}