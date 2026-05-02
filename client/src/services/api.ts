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
  modo?:            string  // 'pyme' | '' sin valor = modo empresa grande
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

// tipos y funciones de autenticación

export interface RespuestaAuth {
  ok:      boolean
  token:   string
  usuario: { id: string; email: string; nombre: string }
}

export async function authRegistrar(
  email: string, password: string, nombre: string
): Promise<RespuestaAuth> {
  const respuesta = await axios.post<RespuestaAuth>(`${BASE_URL}/auth/register`, {
    email, password, nombre
  })
  return respuesta.data
}

export async function authLogin(
  email: string, password: string
): Promise<RespuestaAuth> {
  const respuesta = await axios.post<RespuestaAuth>(`${BASE_URL}/auth/login`, {
    email, password
  })
  return respuesta.data
}