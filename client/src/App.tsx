import { Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth }       from './context/AuthContext'
import RutaProtegida                   from './components/RutaProtegida'  
import Home                            from './pages/Home'
import Detalle                         from './pages/Detalle'
import Login                           from './pages/Login'    
import Registro                        from './pages/Registro' 

// Header separado para poder usar useAuth (necesita estar dentro de AuthProvider)
function Header() {
  const { usuario, logout } = useAuth()
  const navigate            = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-800 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div>
          <h1 className="text-lg font-bold text-white">
            Sistema de alertas de licitaciones en tiempo real
          </h1>
          <p className="text-gray-500 text-xs">
            Monitor de licitaciones públicas de Chile
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Badge "En vivo" */}
          <div className="flex items-center gap-2 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            En vivo
          </div>

          {/* Info de usuario autenticado */}
          {usuario && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs hidden sm:block">
                {usuario.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/" element={
              <RutaProtegida><Home /></RutaProtegida>
            } />
            <Route path="/detalle/:codigo" element={
              <RutaProtegida><Detalle /></RutaProtegida>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
