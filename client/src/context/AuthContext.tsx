import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode }                               from 'react'
import { authLogin, authRegistrar }                     from '../services/api'

interface Usuario {
  id:     string
  email:  string
  nombre: string
}

interface AuthContextType {
  usuario:    Usuario | null
  token:      string | null
  cargando:   boolean
  login:      (email: string, password: string) => Promise<void>
  registrar:  (email: string, password: string, nombre: string) => Promise<void>
  logout:     () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario,  setUsuario]  = useState<Usuario | null>(null)
  const [token,    setToken]    = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  // Al montar: recuperar sesión guardada en localStorage
  useEffect(() => {
    const tokenGuardado   = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado)
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setCargando(false)
  }, [])

  async function login(email: string, password: string) {
    const data = await authLogin(email, password)
    persistirSesion(data.token, data.usuario)
  }

  async function registrar(email: string, password: string, nombre: string) {
    const data = await authRegistrar(email, password, nombre)
    persistirSesion(data.token, data.usuario)
  }

  function persistirSesion(nuevoToken: string, nuevoUsuario: Usuario) {
    setToken(nuevoToken)
    setUsuario(nuevoUsuario)
    localStorage.setItem('token',   nuevoToken)
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
  }

  function logout() {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
