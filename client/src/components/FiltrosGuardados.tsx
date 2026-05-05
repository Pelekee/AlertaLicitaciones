import { useEffect, useState } from 'react'
import type { FiltroGuardado } from '../services/api'
import { listarFiltrosGuardados, eliminarFiltro } from '../services/api'

interface Props {
  onCargar: (f: FiltroGuardado) => void  // aplicar el filtro al listado
  refrescarToken: number                  // cambia cuando se guarda uno nuevo
}

export default function FiltrosGuardados({ onCargar, refrescarToken }: Props) {
  const [filtros,  setFiltros]  = useState<FiltroGuardado[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargar()
  }, [refrescarToken])

  async function cargar() {
    try {
      setCargando(true)
      const lista = await listarFiltrosGuardados()
      setFiltros(lista)
    } catch {
      setFiltros([])
    } finally {
      setCargando(false)
    }
  }

  async function handleEliminar(id: string) {
    await eliminarFiltro(id)
    setFiltros(f => f.filter(x => x.id !== id))
  }

  if (cargando)         return null
  if (filtros.length === 0) return null

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
      <p className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">
        Mis filtros guardados
      </p>
      <div className="flex flex-wrap gap-2">
        {filtros.map(f => (
          <div
            key={f.id}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg px-3 py-1.5 transition group"
          >
            <button
              onClick={() => onCargar(f)}
              className="text-white text-xs font-medium"
              title="Aplicar este filtro"
            >
              {f.nombre}
            </button>
            <button
              onClick={() => handleEliminar(f.id)}
              className="text-gray-500 hover:text-red-400 text-xs transition"
              title="Eliminar filtro"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
