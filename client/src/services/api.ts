/* Flujo: React → api.ts → localhost:3000 → ChileCompra */
import axios from 'axios'
import type { RespuestaLicitaciones } from '../types/licitacion.types'
 
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