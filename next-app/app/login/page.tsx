"use client";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {

    return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Entrar no Sistema</h1>
        <LoginForm/>
      </div>
    </main>
  );
}