import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma" // Ajusta o caminho se o cliente Prisma estiver noutro local
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // A tua lógica de validação entra aqui
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (isValid) {
          const userWithIdAssString = {
            ...user,
            id: user.id.toString()
          };
          return userWithIdAssString;
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/login", // Opcional: define a tua página de login personalizada
  }
})