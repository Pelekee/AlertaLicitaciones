import { Navigate }   from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth }   from '../context/AuthContext'

export default function RutaProtegida({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useAuth()

  // Mientras lee localStorage no redirige todavía
  if (cargando) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!usuario) return <Navigate to="/login" replace />

  return <>{children}</>
}
