// FACTORES Y PESOS:
//   Días restantes  → 30 puntos máx
//   Monto estimado  → 25 puntos máx
//   Estado          → 25 puntos máx
//   Tipo licitación → 20 puntos máx
//   TOTAL           → 100 puntos máx

import { Licitacion, ScoreResult } from '../types/chilecompra.types'

// Lógica: El punto óptimo es entre 3 y 15 días.
// - Muy pocos días (< 3): no da tiempo de preparar oferta - puntaje bajo
// - Días óptimos (3-15): tiempo justo - puntaje máximo
// - Muchos días (> 30): la licitación acaba de publicarse,
//   puede cambiar o ser revocada - puntaje medio
function calcularPuntajeDias(licitacion: Licitacion): number {

  // La API nos entrega DiasCierreLicitacion directamente
  // Si no viene, se calcula desde FechaCierre.
  let dias: number

  if (licitacion.DiasCierreLicitacion !== undefined) {
    dias = licitacion.DiasCierreLicitacion
  } else {
    const ahora     = new Date()
    const fechaCierre = new Date(licitacion.FechaCierre)
    const diffMs    = fechaCierre.getTime() - ahora.getTime()
    dias            = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }

  if (dias <= 0)  return 0 // Ya cerró o cierra hoy - sin oportunidad
  if (dias < 3)   return 5 // Menos de 3 días - muy poco tiempo
  if (dias <= 7)  return 30 // Entre 3 y 7 días - buen tiempo, puntaje alto
  if (dias <= 15) return 28  // Entre 8 y 15 días - tiempo óptimo
  if (dias <= 30) return 20  // Entre 16 y 30 días - tiempo suficiente
  return 12  // Más de 30 días - recién publicada, puede cambiar
}

// Lógica: Los montos medianos (L1/LE) son más accesibles para empresas pequeñas. 
// Los LP son muy competitivos (Empresas Grandes).
function calcularPuntajeMonto(licitacion: Licitacion): number {

  // Si el monto no es visible o no existe → puntaje neutro
  if (!licitacion.MontoEstimado || licitacion.VisibilidadMonto === 0) {
    return 12
  }

  const monto = licitacion.MontoEstimado

  if (monto < 5_000_000)   return 25 // Montos pequeños (< 5M CLP) - muy accesibles
  if (monto < 50_000_000)  return 22 // Montos medianos (5M - 50M) - accesibles
  if (monto < 200_000_000) return 15  // Montos grandes (50M - 200M) - requieren más capacidad
  return 8  // Montos muy grandes (> 200M) - muy competitivos
}

function calcularPuntajeEstado(licitacion: Licitacion): number {
  switch (Number(licitacion.CodigoEstado)) { 
    case 5:  return 25  // Publicada - oportunidad activa
    case 6:  return 5   // Cerrada - ya no se puede ofertar
    case 7:  return 3   // Desierta - sin oferentes, puede re-licitarse
    case 8:  return 2   // Adjudicada - proceso terminado
    case 18: return 0   // Revocada - cancelada
    case 19: return 0   // Suspendida - pausada
    default: return 0
  }
}

// ------------------------------------------
// FACTOR 4 — Tipo de licitación (20 pts máx)
//
// L1 < 100 UTM: las más accesibles, menos competencia
// LE 100-1000 UTM: accesibles, más empresas compiten
// LP/LQ/LR > 1000 UTM: muy competitivas, requieren más recursos
// Privadas: menos transparentes, menor oportunidad
// ------------------------------------------
function calcularPuntajeTipo(licitacion: Licitacion): number {
  switch (licitacion.Tipo) {
    case 'L1': return 20  // Menor a 100 UTM - Muy accesible
    case 'LE': return 17  // 100-1000 UTM - accessible
    case 'LP': return 12  // 1000-2000 UTM - requiere más capacidad
    case 'LQ': return 8   // 2000-5000 UTM - gran competencia
    case 'LR': return 5   // > 5000 UTM - muy demandante
    case 'LS': return 15  // Servicios especializados - niche específico

    // Licitaciones privadas → menor oportunidad (proceso no abierto)
    case 'E2':
    case 'CO':
    case 'B2':
    case 'H2':
    case 'I2': return 6
    default:   return 10  // Tipo desconocido - puntaje neutro
  }
}


// Recibe una licitación y devuelve su ScoreResult
export function calcularScore(licitacion: Licitacion): ScoreResult {

  // Calculamos cada factor por separado
  const factorDias   = calcularPuntajeDias(licitacion)
  const factorMonto  = calcularPuntajeMonto(licitacion)
  const factorEstado = calcularPuntajeEstado(licitacion)
  const factorTipo   = calcularPuntajeTipo(licitacion)

  // Sumamos todos los factores
  const puntaje = factorDias + factorMonto + factorEstado + factorTipo

  // Determinamos el nivel y color según el puntaje total
  let nivel: ScoreResult['nivel']
  let color: ScoreResult['color']

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
    color,
    factores: {
      diasRestantes: factorDias,
      monto:         factorMonto,
      estado:        factorEstado,
      tipo:          factorTipo,
    }
  }
}

// Ordena de mayor a menor puntaje
export function calcularScoreLista(
  licitaciones: Licitacion[]
): Array<Licitacion & { score: ScoreResult }> {

  return licitaciones
    .map(lic => ({
      ...lic,
      score: calcularScore(lic)
    }))
    .sort((a, b) => b.score.puntaje - a.score.puntaje)
}