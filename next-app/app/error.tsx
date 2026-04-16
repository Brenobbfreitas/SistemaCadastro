'use client' // O error.tsx TEM de ser 'use client' para poder ter o botão de "Tentar Novamente"

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void // Função nativa do Next.js para recarregar a página
}) {
  
  // Regista o erro no terminal para tu (programador) poderes ver o que falhou
  useEffect(() => {
    console.error("Erro capturado pelo Next.js:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-xl max-w-md shadow-lg">
        
        {/* Ícone e Título */}
        <h2 className="text-2xl font-bold text-red-400 mb-3">
          ⚠️ Ops! Algo correu mal.
        </h2>
        
        <p className="text-gray-300 mb-6">
          Não foi possível carregar a informação desta página. Pode ser uma falha de ligação.
        </p>
        
        {/* Botão para recarregar */}
        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}