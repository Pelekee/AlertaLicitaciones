import type { Licitacion, ScoreResult } from '../types/chilecompra.types'  // ← actualizado: + ScoreResult

// Días restantes para cierre 30 pts máx
function puntajeDias(dias?: number): number {
  if (dias === undefined || dias === null) return 0
  if (dias > 15)  return 30  // Tiempo suficiente para preparar oferta
  if (dias >= 8)  return 20
  if (dias >= 3)  return 10
  return 0                   // ≤ 2 días: demasiado urgente
}

// Monto estimado 25 pts máx
function puntajeMonto(monto?: number): number {
  if (monto === undefined || monto === null) return 5  // sin info → neutro
  if (monto >= 10_000_000) return 25
  if (monto >= 1_000_000)  return 15
  if (monto >= 100_000)    return 8
  return 3
}

// Estado 25 pts máx
// 5=Publicada | 6=Cerrada | 7=Desierta | 8=Adjudicada | 18=Revocada | 19=Suspendida
function puntajeEstado(codigoEstado: string): number {
  switch (codigoEstado) {
    case '5':  return 25  // Publicada — oportunidad activa
    case '7':  return 5   // Desierta — no se adjudicó, pero puede reabrirse
    case '19': return 10  // Suspendida — puede reactivarse
    default:   return 0   // Cerrada, Adjudicada, Revocada
  }
}

// Tipo de licitación 20 pts máx
// L1 < 100 UTM | LE 100-1000 | LP 1000-2000 | LQ 2000-5000 | LR > 5000 | LS especializados
function puntajeTipo(tipo?: string): number {
  switch (tipo) {
    case 'LR': return 20  // > 5.000 UTM
    case 'LQ': return 18  // 2.000 - 5.000 UTM
    case 'LP': return 15  // 1.000 - 2.000 UTM
    case 'LS': return 12  // Servicios especializados
    case 'LE': return 10  // 100 - 1.000 UTM
    case 'L1': return 5   // < 100 UTM
    default:   return 5   // Tipo desconocido
  }
}

export function calcularScore(licitacion: Licitacion): ScoreResult {  // ← actualizado: ScoreResult
  const diasRestantes = puntajeDias(licitacion.DiasCierreLicitacion)  // ← renombrado
  const monto         = puntajeMonto(licitacion.MontoEstimado)
  const estado        = puntajeEstado(String(licitacion.CodigoEstado))
  const tipo          = puntajeTipo(licitacion.Tipo)

  const puntaje = Math.min(100, Math.max(1, diasRestantes + monto + estado + tipo))

  let nivel: ScoreResult['nivel']
  let color: ScoreResult['color']  // ← nuevo

  if (puntaje >= 70) {
    nivel = 'Alta'
    color = 'green'
  } else if (puntaje >= 40) {
    nivel = 'Media'
    color = 'yellow'
  } else {
    nivel = 'Baja'
    color = 'red'
  }

  return {
    puntaje,
    nivel,
    color,                                                   // ← nuevo
    factores: { diasRestantes, monto, estado, tipo }         // ← actualizado: detalle → factores
  }
}
