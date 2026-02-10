import Link from "next/link";
import { auth, signOut } from "@/auth"; 

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center text-white">
        <Link href="/" className="text-xl font-bold text-blue-500">
          SysManager
        </Link>

        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <Link href="/home" className="hover:text-blue-400">Home</Link>
              <span className="text-gray-500">|</span>
              <span className="text-sm text-gray-300">Olá, {session.user?.name}</span>
              
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}>
                <button className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1 rounded">Sair</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400">Login</Link>
              <Link href="/cadastro" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}