'use server'


import { auth, signOut, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { hash } from "bcryptjs";


export async function getUsers() {
  return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function logout(){
  await signOut({redirectTo: "/login"});
}

export async function login(formData: FormData){
// constantes armazenando form
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
// motor da autenticação
    try {
      await signIn("credentials",{
        email,
        password,
        redirectTo: "/home"
      });
    } catch (error) {
      if (error instanceof AuthError) {
        throw Error("Login Errado");
        
      }
      throw error;
      
    }

}

export async function addUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const passwordHash = await hash(password, 12)



  await prisma.user.create({ 
    data: { 
      name, 
      email, 
      password: passwordHash
    } 
  })
  revalidatePath('/')
  redirect('/login')
}


export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  if (id && name && email) {
    await prisma.user.update({
      where:{id: parseInt(id)},
      data: {name, email},
    })

    revalidatePath('/')
  }
}




export async function deleteUser(formData: FormData) {

  const id = formData.get('id') as string;//  Extrai o ID da "caixa"

  const session = await auth(); // sessão atual 

  await prisma.user.delete({
    where: { id: parseInt(id) }
  });

  //  Comparamos: o ID apagado é o do utilizador atual?
  if (session?.user?.id === id) {
    await signOut({ redirectTo: "/login" }); // 3. Logout automático! 
  }

  revalidatePath("/home");
}
