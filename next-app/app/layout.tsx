import "./global.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar"; 
import { Toaster } from "react-hot-toast"; // <-- 1. Importamos o Toaster

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Providers>
          <Navbar /> 
          
          <main className="container mx-auto px-4">
            {children}
          </main>

          {/* <-- 2. Adicionamos o Toaster no final do body */}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1f2937', // bg-gray-800
                color: '#f3f4f6', // text-gray-100
                border: '1px solid #374151', // border-gray-700
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}