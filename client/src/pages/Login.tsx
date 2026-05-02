import { useState } from 'react'
import type {SyntheticEvent} from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import { useAuth }             from '../context/AuthContext'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)] px-4">
      <div className="w-full max-w-sm">

        <h2 className="text-white text-2xl font-bold mb-1 text-center">Iniciar sesión</h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Accede a tu cuenta para ver licitaciones
        </p>

        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4">

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

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
            <label className="text-gray-400 text-xs">Contraseña</label>
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
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-blue-400 hover:text-blue-300 transition">
            Regístrate gratis
          </Link>
        </p>

      </div>
    </div>
  )
}
