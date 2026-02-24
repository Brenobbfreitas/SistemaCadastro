import { auth } from "@/auth"

// 1. Rotas que qualquer pessoa pode aceder (ex: a landing page inicial)
const publicRoutes = ["/"] 
// 2. Rotas exclusivas para quem NÃO está logado
const authRoutes = ["/login", "/cadastro"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth // Verifica se existe sessão ativa 🔐

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // CENÁRIO A: O utilizador JÁ ESTÁ logado e tenta aceder ao Login/Cadastro
  // Ação: Mandamos o utilizador de volta para a Home
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL("/home", nextUrl))
  }

  // CENÁRIO B: O utilizador NÃO ESTÁ logado e tenta aceder a uma rota privada (ex: /home)
  // Ação: Expulsamos para a página de Login
  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  // CENÁRIO C: Tudo certo, deixa passar!
  return;
})

export const config = {
  // Ignora ficheiros internos do Next.js e da API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}