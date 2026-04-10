interface Filtros {
  estado:          string
  fecha:           string
  CodigoOrganismo: string
}

interface Props {
  filtros:    Filtros
  onFiltrar:  (filtros: Filtros) => void
  onLimpiar:  () => void
  cargando:   boolean
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

export default function SearchBar({ filtros, onFiltrar, onLimpiar, cargando }: Props) {

  // Cuando cambia cualquier campo, actualizamos solo ese campo
  // y mantenemos el resto igual usando el spread operator
  function handleChange(campo: keyof Filtros, valor: string) {
    onFiltrar({ ...filtros, [campo]: valor })
  }

  // Verificamos si hay algún filtro activo para mostrar el botón limpiar
  const hayFiltros = filtros.estado || filtros.fecha || filtros.CodigoOrganismo

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">

      <p className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">
        Filtros de búsqueda
      </p>

      <div className="flex flex-wrap gap-3">

        {/* Filtro por Estado */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-gray-500 text-xs">Estado</label>
          <select
            value={filtros.estado}
            onChange={e => handleChange('estado', e.target.value)}
            disabled={cargando}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ESTADOS.map(op => (
              <option key={op.valor} value={op.valor}>
                {op.etiqueta}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Fecha */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-gray-500 text-xs">
            Fecha <span className="text-gray-600">(formato: ddmmaaaa)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: 06042026"
            value={filtros.fecha}
            onChange={e => handleChange('fecha', e.target.value)}
            disabled={cargando}
            maxLength={8}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Filtro por Código de Organismo */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-gray-500 text-xs">
            Código organismo <span className="text-gray-600">(ej: 6945)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: 6945"
            value={filtros.CodigoOrganismo}
            onChange={e => handleChange('CodigoOrganismo', e.target.value)}
            disabled={cargando}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-1 justify-end min-w-[120px]">
          <label className="text-gray-500 text-xs opacity-0 select-none">Acciones</label>
          <div className="flex gap-2">

            {/* Botón Buscar */}
            <button
              onClick={() => onFiltrar(filtros)}
              disabled={cargando}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {cargando ? '...' : 'Buscar'}
            </button>

            {/* Botón Limpiar — solo visible si hay filtros activos */}
            {hayFiltros && (
              <button
                onClick={onLimpiar}
                disabled={cargando}
                className="text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 disabled:opacity-50 text-sm px-3 py-2 rounded-lg transition"
                title="Limpiar filtros"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}