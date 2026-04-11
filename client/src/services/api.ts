/* Flujo: React → api.ts → localhost:3000 → ChileCompra */
import axios from 'axios'
import type { RespuestaLicitaciones, RespuestaDetalle } from '../types/licitacion.types'
 
// URL base de nuestro backend
// En desarrollo apunta a localhost:3000
const BASE_URL = 'http://localhost:3000/api'

export async function getLicitaciones(filtros?: {
  fecha?:           string
  estado?:          string
  CodigoOrganismo?: string
}): Promise<RespuestaLicitaciones> {
 
  const respuesta = await axios.get<RespuestaLicitaciones>(
    `${BASE_URL}/licitaciones`,
    { params: filtros }
  )
 
  return respuesta.data
}

export async function getLicitacionDetalle(codigo: string): Promise<RespuestaDetalle> {
  const respuesta = await axios.get<RespuestaDetalle>(
    `${BASE_URL}/licitaciones/${codigo}`
  )
  return respuesta.data
}