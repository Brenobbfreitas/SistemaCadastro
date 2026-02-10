import "./global.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar"; // <--- Importe aqui

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 text-gray-100">
        <Providers>
          <Navbar /> 
          <main className="container mx-auto px-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}