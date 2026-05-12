import Link from "next/link";
import { auth, signOut } from "@/auth";
import { LayoutDashboard, Users, FolderKanban, LogOut, User, LogIn } from "lucide-react";

export default async function Navbar() {
  const session = await auth();

  return (
    // "sticky top-0" faz a navbar acompanhar o scroll sem quebrar a página
    // "backdrop-blur-md" dá o efeito de vidro fosco quando algo passa por baixo
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link href={session ? "/home" : "/"} className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-sky-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-900/40 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xs">SM</span>
            </div>
            <span className="text-white font-bold tracking-tight hidden sm:block">
              SysManager<span className="text-sky-500">.</span>
            </span>
          </Link>

          {/* LADO DIREITO (Menu + Perfil) */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {/* LINKS DE NAVEGAÇÃO PRINCIPAL (Esconde no telemóvel muito pequeno, mostra no tablet/PC) */}
                <div className="hidden md:flex items-center gap-1 mr-2">
                  <Link href="/home" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all">
                    <LayoutDashboard size={16} className="text-sky-500" /> Dashboard
                  </Link>
                  <Link href="/novo-cliente" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all">
                    <Users size={16} className="text-sky-500" /> Clientes
                  </Link>
                  <Link href="/novo-projeto" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all">
                    <FolderKanban size={16} className="text-purple-500" /> Projetos
                  </Link>
                </div>

                {/* PERFIL DO USUÁRIO E BOTÃO SAIR */}
                <div className="flex items-center gap-4 border-l border-gray-800/50 pl-4 sm:pl-6">
                  
                  {/* Info do Utilizador (Avatar e Nome) */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-semibold text-gray-200">{session.user?.name}</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-900/20 border border-gray-800">
                      {session.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                    </div>
                  </div>
                  
                  {/* Botão de Logout Seguro (Server Action) */}
                  <form action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}>
                    <button 
                      type="submit" 
                      title="Sair do sistema"
                      className="h-9 w-9 rounded-xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all group"
                    >
                      <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* ESTADO DESLOGADO */
              <>
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/cadastro" className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-900/20 font-medium active:scale-95">
                  <LogIn size={16} /> Cadastrar
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}