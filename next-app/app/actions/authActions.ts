'use server'

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/home"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Retorna erro se a senha estiver errada
      if (error.type === 'CredentialsSignin') {
        return { error: "E-mail ou senha incorretos." };
      }
      return { error: "Erro na autenticação." };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}