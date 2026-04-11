import { useEffect, useState }       from 'react'
import { useParams, useNavigate }    from 'react-router-dom'
import { getLicitacionDetalle }      from '../services/api'
import { ESTADO_TEXTO, TIPO_TEXTO }  from '../types/licitacion.types'
import type { LicitacionDetalle }    from '../types/licitacion.types'

function formatearFecha(fechaISO?: string): string {
  if (!fechaISO) return '—'
  return new Date(fechaISO).toLocaleString('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatearMonto(monto?: number, moneda?: string): string {
  if (!monto) return 'No disponible'
  if (moneda === 'UTM') return `${monto.toLocaleString('es-CL')} UTM`
  if (moneda === 'USD') return `USD ${monto.toLocaleString('es-CL')}`
  return monto.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  })
}

export default function Detalle() {
  const { codigo }  = useParams<{ codigo: string }>()
  const navigate    = useNavigate()

  const [licitacion, setLicitacion] = useState<LicitacionDetalle | null>(null)
  const [cargando, setCargando]     = useState<boolean>(true)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    if (!codigo) return
    cargarDetalle()
  }, [codigo])

  async function cargarDetalle() {
    try {
      setCargando(true)
      setError(null)
      const data = await getLicitacionDetalle(codigo!)
      setLicitacion(data.licitacion)
    } catch (err) {
      console.error('Error al cargar detalle:', err)
      setError('No se pudo cargar el detalle de esta licitación.')
    } finally {
      setCargando(false)
    }
  }

  // Estado de carga
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Cargando detalle...</p>
      </div>
    )
  }

  // Estado de error
  if (error || !licitacion) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-4xl"></p>
        <p className="text-red-400 text-sm text-center max-w-md">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          Volver al listado
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 transition"
      >
        ← Volver al listado
      </button>

      {/* Encabezado */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {licitacion.CodigoExterno}
          </span>
          {licitacion.Tipo && (
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {licitacion.Tipo} — {TIPO_TEXTO[licitacion.Tipo] ?? licitacion.Tipo}
            </span>
          )}
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
            {ESTADO_TEXTO[licitacion.CodigoEstado] ?? 'Desconocido'}
          </span>
        </div>
        <h2 className="text-white text-xl font-bold mb-2">{licitacion.Nombre}</h2>
        {licitacion.Descripcion && (
          <p className="text-gray-400 text-sm leading-relaxed">{licitacion.Descripcion}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Organismo comprador */}
        {licitacion.Comprador && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">
              🏛️ Organismo comprador
            </h3>
            <p className="text-white text-sm font-medium">{licitacion.Comprador.NombreOrganismo}</p>
            {licitacion.Comprador.ComunaUnidad && (
              <p className="text-gray-400 text-xs mt-1">{licitacion.Comprador.ComunaUnidad}</p>
            )}
            {licitacion.Comprador.RegionUnidad && (
              <p className="text-gray-400 text-xs">{licitacion.Comprador.RegionUnidad}</p>
            )}
          </div>
        )}

        {/* Monto y fechas */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">
            Monto y plazo
          </h3>
          <p className="text-white text-sm font-medium mb-2">
            {formatearMonto(licitacion.MontoEstimado, licitacion.Moneda)}
          </p>
          <p className="text-gray-400 text-xs">
            Cierre: {formatearFecha(licitacion.FechaCierre)}
          </p>
          {licitacion.DiasCierreLicitacion !== undefined && (
            <p className={`text-xs font-medium mt-1 ${
              licitacion.DiasCierreLicitacion <= 3 ? 'text-red-400'
              : licitacion.DiasCierreLicitacion <= 7 ? 'text-yellow-400'
              : 'text-gray-400'
            }`}>
              {licitacion.DiasCierreLicitacion <= 0
                ? 'Licitación cerrada'
                : `${licitacion.DiasCierreLicitacion} días restantes`}
            </p>
          )}
        </div>

        {/* Fechas del proceso */}
        {licitacion.Fechas && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">
              Fechas del proceso
            </h3>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Publicación</span>
                <span className="text-gray-300">{formatearFecha(licitacion.Fechas.FechaPublicacion)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Apertura técnica</span>
                <span className="text-gray-300">{formatearFecha(licitacion.Fechas.FechaActoAperturaTecnica)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Apertura económica</span>
                <span className="text-gray-300">{formatearFecha(licitacion.Fechas.FechaActoAperturaEconomica)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Adj. estimada</span>
                <span className="text-gray-300">{formatearFecha(licitacion.Fechas.FechaEstimadaAdjudicacion)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Contacto */}
        {licitacion.NombreResponsableContrato && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">
            Responsable contrato
            </h3>
            <p className="text-white text-sm">{licitacion.NombreResponsableContrato}</p>
            {licitacion.EmailResponsableContrato && (
              <p className="text-gray-400 text-xs mt-1">{licitacion.EmailResponsableContrato}</p>
            )}
            {licitacion.FonoResponsableContrato && (
              <p className="text-gray-400 text-xs">{licitacion.FonoResponsableContrato}</p>
            )}
          </div>
        )}
      </div>

      {/* Items / productos */}
      {licitacion.Items && licitacion.Items.Cantidad > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4">
            Productos / servicios ({licitacion.Items.Cantidad})
          </h3>
          <div className="flex flex-col gap-3">
            {licitacion.Items.Listado.map((item, i) => (
              <div key={i} className="border-t border-gray-700 pt-3 first:border-0 first:pt-0">
                <p className="text-white text-sm font-medium">
                  {item.NombreProducto ?? `Ítem ${item.Correlativo}`}
                </p>
                {item.Categoria && (
                  <p className="text-gray-500 text-xs mt-0.5">{item.Categoria}</p>
                )}
                {item.Descripcion && (
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.Descripcion}</p>
                )}
                {item.Cantidad && item.UnidadMedida && (
                  <p className="text-gray-500 text-xs mt-1">
                    Cantidad: {item.Cantidad} {item.UnidadMedida}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}