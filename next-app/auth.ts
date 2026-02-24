import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma" 
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Busca o utilizador pelo e-mail
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        // Compara a senha digitada com o Hash do banco de dados
        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (isValid) {
          return {
            ...user,
            id: user.id.toString() // Converte ID para string
          };
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/login", // Redireciona para a nossa página customizada em caso de erro
  },
  // ==========================================
  // CALLBACKS: A ponte entre o Token e a Sessão
  // ==========================================
  callbacks: {
    // 1. Coloca o ID do utilizador dentro do Token (JWT) 
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // 2. Passa o ID do Token para a Sessão (para podermos usar no Frontend)
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})