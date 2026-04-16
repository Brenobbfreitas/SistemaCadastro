export default function Loading() {
  return (
    // Centra o conteúdo no meio do ecrã
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      
      {/* Círculo (Spinner) feito com Tailwind */}
      <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      
      {/* Mensagem amigável */}
      <p className="mt-4 text-gray-400 font-medium animate-pulse">
        A carregar dados...
      </p>
      
    </div>
  )
}