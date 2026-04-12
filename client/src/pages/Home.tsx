import { useEffect, useState, useRef } from 'react' // ← actualizado: + useRef
import { getLicitaciones }     from '../services/api'
import LicitacionCard          from '../components/LicitacionCard'
import SearchBar               from '../components/SearchBar'
import type { LicitacionBasica }    from '../types/licitacion.types'
interface Filtros {
  estado:          string
  fecha:           string
  CodigoOrganismo: string
}
 
const FILTROS_INICIALES: Filtros = {
  estado:          '',
  fecha:           '',
  CodigoOrganismo: '',
}

const POLLING_INTERVAL = 5 * 60 * 1000 // ← nuevo: 5 minutos en ms

export default function Home() {

  // Estado para el listado de licitaciones
  const [licitaciones, setLicitaciones]   = useState<LicitacionBasica[]>([])

  // Estado para la cantidad total que devuelve la API
  const [cantidad, setCantidad]           = useState<number>(0)

  // Estado de carga — true mientras espera la respuesta
  const [cargando, setCargando]           = useState<boolean>(true)

  // Estado de error — guarda el mensaje si algo falla
  const [error, setError]                 = useState<string | null>(null)

  const [filtros, setFiltros]             = useState<Filtros>(FILTROS_INICIALES)
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null) // ← nuevo
  const filtrosRef = useRef<Filtros>(FILTROS_INICIALES) 

  useEffect(() => {
    cargarLicitaciones(FILTROS_INICIALES) /* con esto recibimos el filtro */
  }, []) // [] = solo al montar, no en cada render

  // polling automatico cada 5 minutos
  useEffect(() => {
    const intervalo = setInterval(() => {
      cargarLicitaciones(filtrosRef.current)
    }, POLLING_INTERVAL)
    return () => clearInterval(intervalo) // limpiar al desmontar
  }, [])

  async function cargarLicitaciones(filtrosActivos: Filtros) {
    try {
      setCargando(true)
      setError(null)

      const params: Record<string, string> = {}
      if (filtrosActivos.estado) params.estado = filtrosActivos.estado
      if (filtrosActivos.fecha) params.fecha = filtrosActivos.fecha
      if (filtrosActivos.CodigoOrganismo) params.CodigoOrganismo = filtrosActivos.CodigoOrganismo

      const data = await getLicitaciones(Object.keys(params).length > 0 ? params : undefined)
      console.log('Licitaciones recibidas del backend:', data)

      setLicitaciones(data.licitaciones.slice(0, 50)) // solo 50 para no colapsar el frontend
      setCantidad(data.cantidad)
      setUltimaActualizacion(new Date())

    } catch (err) {
      console.error('Error al cargar licitaciones:', err)
      setError('No se pudieron cargar las licitaciones. Verifica que el servidor esté corriendo.')
    } finally {
      // finally siempre se ejecuta, haya error o no
      setCargando(false)
    }
  }
  function handleFiltrar(nuevosFiltros: Filtros) {
    filtrosRef.current = nuevosFiltros // actualiza la referencia para el polling
    setFiltros(nuevosFiltros)
    cargarLicitaciones(nuevosFiltros)
  }

  function handleLimpiar() {
    filtrosRef.current = FILTROS_INICIALES //
    setFiltros(FILTROS_INICIALES)
    cargarLicitaciones(FILTROS_INICIALES)
  }

  /* Renderizado para el estado */
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Cargando licitaciones...</p>
      </div>
    )
  }
  /*Renderizado para el estado de error*/
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-4xl">⚠️</p>
        <p className="text-red-400 text-sm text-center max-w-md">{error}</p>
        <button
          onClick={() => cargarLicitaciones(filtros)} // ← actualizado: fix tipo incorrecto
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Reintentar
        </button>
      </div>
    )
  }
  /* render cargado con datos */
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SearchBar
        filtros={filtros}
        onFiltrar={handleFiltrar}
        onLimpiar={handleLimpiar}
        cargando={cargando}
      />
      {/* Header con contador */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">
            Licitaciones activas
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {cantidad.toLocaleString('es-CL')} licitaciones encontradas hoy
          </p>
        </div>
        <div className="flex flex-col items-end gap-1"> {/* ← nuevo: agrupa botón + timestamp */}
          <button
            onClick={() => cargarLicitaciones(filtros)} 
            className="text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg transition flex items-center gap-2"
          >
            <span>↻</span>
            <span>Recargar</span>
          </button>
          {ultimaActualizacion && ( // muestra hora de última actualización
            <p className="text-xs text-gray-600">
              Actualizado: {ultimaActualizacion.toLocaleTimeString('es-CL')} · Auto cada 5 min
            </p>
          )}
        </div>
      </div>

      {/* Grid de tarjetas */}
      {licitaciones.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          No se encontraron licitaciones para hoy.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {licitaciones.map(lic => (
            <LicitacionCard
              key={lic.CodigoExterno}
              licitacion={lic}
            />
          ))}
        </div>
      )}
    </div>
  )
}