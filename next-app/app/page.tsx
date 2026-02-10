import Link from "next/link";
import { auth } from "@/auth"; 
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();

  // Se já estiver logado, vai pro painel
  if (session) {
    redirect("/home");
  }

  // Se não, mostra a capa
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="space-y-4 max-w-3xl px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          SysManager
        </h1>
        <p className="text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
          A solução completa e segura para gerenciamento de usuários. 
          <br/><span className="text-blue-500 text-sm">Powered by Next.js 15 & Docker</span>
        </p>
      </div>

      <div className="flex gap-4 mt-8">
        <Link 
          href="/login" 
          className="bg-gray-800 border border-gray-700 hover:border-blue-500 text-white font-semibold py-3 px-10 rounded-lg transition-all hover:scale-105"
        >
          Entrar no Sistema
        </Link>
        <Link 
          href="/cadastro" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg shadow-lg shadow-blue-900/50 transition-all hover:scale-105"
        >
          Criar Conta
        </Link>
      </div>
    </div>
  );
}