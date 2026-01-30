import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth // Verifica se existe uma sessão ativa 🔐

  // Se não estiver logado e tentar acessar algo que não seja o login, manda para o login
  if (!isLoggedIn && nextUrl.pathname !== "/login" && nextUrl.pathname !== "/cadastro") {
    return Response.redirect(new URL("/login", nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}