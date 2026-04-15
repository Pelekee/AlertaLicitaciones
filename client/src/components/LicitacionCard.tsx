import type { LicitacionBasica, ScoreOportunidad } from '../types/licitacion.types'
import { ESTADO_TEXTO, TIPO_TEXTO } from '../types/licitacion.types'
import { useNavigate } from 'react-router-dom'
interface Props {
  licitacion: LicitacionBasica
}
// Formatea una fecha ISO a formato legible en español
// "2026-04-09T15:00:00" → "9 abr 2026, 15:00"
function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO)
  return fecha.toLocaleString('es-CL', {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}
/* Formateo numerico a CLP*/
function formatearMonto(monto: number, moneda?: string): string {
  if (moneda === 'UTM') return `${monto.toLocaleString('es-CL')} UTM`
  if (moneda === 'USD') return `USD ${monto.toLocaleString('es-CL')}`

  return monto.toLocaleString('es-CL', {
    style:    'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  })
}

// clases Tailwind según color del score
function colorScore(color: ScoreOportunidad['color']): string {
  switch (color) {
    case 'green':  return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    case 'red':    return 'bg-red-500/20 text-red-400 border border-red-500/30'
  }
}

function colorEstado(codigo: number): string {
  switch (codigo) {
    case 5:  return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case 6:  return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    case 7:  return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    case 8:  return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    case 18:
    case 19: return 'bg-red-500/20 text-red-400 border border-red-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}

export default function LicitacionCard({ licitacion }: Props) {
  const navigate = useNavigate()
  const {
    CodigoExterno,
    Nombre,
    CodigoEstado,
    FechaCierre,
    Tipo,
    MontoEstimado,
    Moneda,
    DiasCierreLicitacion,
    Comprador,
    score,
  } = licitacion

  return (
    <div 
    onClick={() => navigate(`/detalle/${CodigoExterno}`)}
    className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-500 transition-colors">

      {/* Fila superior: código + estado + tipo */}
      <div className="flex flex-wrap items-center gap-2 mb-3">

        {/* Código de la licitación */}
        <span className="text-xs font-mono text-gray-400 bg-gray-700 px-2 py-1 rounded">
          {CodigoExterno}
        </span>

        {/* Badge de estado */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorEstado(CodigoEstado)}`}>
          {ESTADO_TEXTO[CodigoEstado] ?? 'Desconocido'}
        </span>

        {/* Tipo de licitación si existe */}
        {Tipo && (
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {Tipo} — {TIPO_TEXTO[Tipo] ?? Tipo}
          </span>
        )}

        {/* Badge de score de oportunidad */}
        {score && (
          <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-lg ${colorScore(score.color)}`}>
            {score.puntaje} · {score.nivel}
          </span>
        )}
      </div>

      {/* Nombre de la licitación */}
      <h3 className="text-white font-semibold text-sm leading-snug mb-3">
        {Nombre}
      </h3>

      {/* Organismo comprador */}
      {Comprador && (
        <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
          <span>Organismo</span>
          <span>{Comprador.NombreOrganismo}</span>
          {Comprador.RegionUnidad && (
            <span className="text-gray-500">· {Comprador.RegionUnidad}</span>
          )}
        </p>
      )}

      {/* Fila inferior: monto + fecha cierre + días restantes */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-700">

        {/* Monto estimado */}
        <div>
          {MontoEstimado ? (
            <p className="text-white text-sm font-medium">
              {formatearMonto(MontoEstimado, Moneda)}
            </p>
          ) : (
            <p className="text-gray-500 text-xs">Monto no disponible</p>
          )}
        </div>

        {/* Fecha cierre + días restantes */}
        <div className="text-right">
          <p className="text-gray-400 text-xs">
            Cierra: {formatearFecha(FechaCierre)}
          </p>
          {DiasCierreLicitacion !== undefined && (
            <p className={`text-xs font-medium mt-0.5 ${
              DiasCierreLicitacion <= 3
                ? 'text-red-400'
                : DiasCierreLicitacion <= 7
                  ? 'text-yellow-400'
                  : 'text-gray-400'
            }`}>
              {DiasCierreLicitacion <= 0
                ? 'Cerrada'
                : `${DiasCierreLicitacion} días restantes`
              }
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
