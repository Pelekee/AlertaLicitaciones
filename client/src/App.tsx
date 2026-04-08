import Home from './pages/Home'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo / título */}
          <div>
            <h1 className="text-lg font-bold text-white">
              Sistema de alertas de licitaciones en tiempo real
            </h1>
            <p className="text-gray-500 text-xs">
              Monitor de licitaciones públicas de Chile
            </p>
          </div>

          {/* Badge "En vivo" */}
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            En vivo
          </div>

        </div>
      </header>

      {/* Contenido principal */}
      <main>
        <Home />
      </main>

    </div>
  )
}