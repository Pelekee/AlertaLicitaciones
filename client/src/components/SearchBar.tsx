import { useState } from 'react'              
import { guardarFiltro } from '../services/api'  

interface Filtros {
  estado:          string
  fecha:           string
  CodigoOrganismo: string
  modo:            string  // '' = general | 'pyme' = PYME
}

interface Props {
  filtros:        Filtros
  onFiltrar:      (filtros: Filtros) => void
  onLimpiar:      () => void
  cargando:       boolean
  onFiltroGuardado?: () => void  //callback para refrescar la lista de guardados
}

// Opciones del select de estado
const ESTADOS = [
  { valor: '',           etiqueta: 'Todos los estados' },
  { valor: 'activas',    etiqueta: 'Activas (publicadas hoy)' },
  { valor: 'publicada',  etiqueta: 'Publicada' },
  { valor: 'cerrada',    etiqueta: 'Cerrada' },
  { valor: 'adjudicada', etiqueta: 'Adjudicada' },
  { valor: 'desierta',   etiqueta: 'Desierta' },
  { valor: 'revocada',   etiqueta: 'Revocada' },
  { valor: 'suspendida', etiqueta: 'Suspendida' },
  { valor: 'todos',      etiqueta: 'Todos (sin filtro)' },
]

export default function SearchBar({ filtros, onFiltrar, onLimpiar, cargando, onFiltroGuardado }: Props) {

  const [guardando, setGuardando] = useState(false)
  const [mostrandoInputSave, setMostrandoInputSave] = useState(false)
  const [nombreNuevoFiltro, setNombreNuevoFiltro] = useState('')

  // Cuando cambia cualquier campo, actualizamos solo ese campo
  // y mantenemos el resto igual usando el spread operator
  function handleChange(campo: keyof Filtros, valor: string) {
    onFiltrar({ ...filtros, [campo]: valor })
  }

const handleGuardarFinal = async () => {
    const nombre = nombreNuevoFiltro.trim()
    if (!nombre) return
    
    try {
      setGuardando(true)
      await guardarFiltro({
        nombre,
        estado: filtros.estado || undefined,
        fecha: filtros.fecha || undefined,
        CodigoOrganismo: filtros.CodigoOrganismo || undefined,
        modo: filtros.modo || undefined,
      })
      setMostrandoInputSave(false)
      setNombreNuevoFiltro('')
      onFiltroGuardado?.()
    } catch {
      alert('No se pudo guardar el filtro')
    } finally {
      setGuardando(false)
    }
  }

  // Verificamos si hay algún filtro activo para mostrar el botón limpiar
  const hayFiltros = filtros.estado || filtros.fecha || filtros.CodigoOrganismo || filtros.modo

return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 mb-6 shadow-xl transition-all">
      
      {/* SECCIÓN SUPERIOR: Perfil y Guardado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Perfil</span>
          <div className="flex p-1 bg-gray-900/50 rounded-xl border border-gray-700">
            <button
              onClick={() => handleChange('modo', '')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filtros.modo === '' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => handleChange('modo', 'pyme')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filtros.modo === 'pyme' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              PYME
            </button>
          </div>
        </div>

        {/* Guardado Inteligente */}
        <div className="flex items-center">
          {mostrandoInputSave ? (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
              <input
                autoFocus
                placeholder="Nombre del filtro..."
                className="bg-gray-900 border border-blue-500/50 text-white text-xs rounded-lg px-3 py-2 focus:ring-2 ring-blue-500/20 outline-none w-44"
                value={nombreNuevoFiltro}
                onChange={(e) => setNombreNuevoFiltro(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuardarFinal()}
              />
              <button 
                onClick={handleGuardarFinal}
                disabled={guardando || !nombreNuevoFiltro.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs p-2 rounded-lg disabled:opacity-50"
              >
                {guardando ? '...' : '✓'}
              </button>
              <button onClick={() => setMostrandoInputSave(false)} className="text-gray-500 hover:text-red-400 p-1">✕</button>
            </div>
          ) : (
            <button
              onClick={() => setMostrandoInputSave(true)}
              className="text-blue-400 hover:text-blue-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors group"
            >
              <span className="bg-blue-500/10 group-hover:bg-blue-500/20 p-1 rounded-md">＋</span>
              Guardar vista actual
            </button>
          )}
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Inputs de Filtro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* Estado */}
        <div className="space-y-1.5">
          <label className="text-gray-500 text-[10px] font-bold uppercase ml-1">Estado</label>
          <select
            value={filtros.estado}
            onChange={e => handleChange('estado', e.target.value)}
            disabled={cargando}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-xl px-3 py-2.5 focus:border-blue-500 outline-none transition-all hover:bg-gray-850"
          >
            {ESTADOS.map(op => (
              <option key={op.valor} value={op.valor}>{op.etiqueta}</option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="space-y-1.5">
          <label className="text-gray-500 text-[10px] font-bold uppercase ml-1">Fecha Publicación</label>
          <input
            type="text"
            placeholder="DDMMAAAA"
            value={filtros.fecha}
            onChange={e => handleChange('fecha', e.target.value)}
            disabled={cargando}
            maxLength={8}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-xl px-3 py-2.5 placeholder-gray-600 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Código Organismo */}
        <div className="space-y-1.5">
          <label className="text-gray-500 text-[10px] font-bold uppercase ml-1">Cód. Organismo</label>
          <input
            type="text"
            placeholder="Ej: 6945"
            value={filtros.CodigoOrganismo}
            onChange={e => handleChange('CodigoOrganismo', e.target.value)}
            disabled={cargando}
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-xl px-3 py-2.5 placeholder-gray-600 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={() => onFiltrar(filtros)}
            disabled={cargando}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
          >
            {cargando ? 'Cargando...' : 'Aplicar'}
          </button>

          {hayFiltros && (
            <button
              onClick={onLimpiar}
              className="px-4 py-2.5 text-gray-400 hover:text-white border border-gray-700 hover:border-red-500/50 hover:bg-red-500/10 rounded-xl transition-all"
              title="Limpiar filtros"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}