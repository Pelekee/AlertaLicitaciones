import { useState } from 'react'
import type {SyntheticEvent} from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import { useAuth }             from '../context/AuthContext'

export default function Registro() {
  const { registrar } = useAuth()
  const navigate      = useNavigate()

  const [nombre,   setNombre]   = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setCargando(true)
    try {
      await registrar(email, password, nombre)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)] px-4">
      <div className="w-full max-w-sm">

        <h2 className="text-white text-2xl font-bold mb-1 text-center">Crear cuenta</h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Monitorea licitaciones públicas de Chile
        </p>

        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4">

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              disabled={cargando}
              placeholder="Tu nombre o empresa"
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={cargando}
              placeholder="tu@correo.cl"
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">Contraseña <span className="text-gray-600">(mín. 6 caracteres)</span></label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={cargando}
              placeholder="••••••"
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2.5 placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition mt-1"
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  )
}
