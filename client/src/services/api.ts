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

// tipos y funciones de filtros guardados (rutas protegidas con JWT)

export interface FiltroGuardado {
  id:               string
  nombre:           string
  estado:           string | null
  fecha:            string | null
  CodigoOrganismo:  string | null
  modo:             string | null
  creadoEn:         string
}

// Helper: header de autorización con el JWT en localStorage
function authHeaders() {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function listarFiltrosGuardados(): Promise<FiltroGuardado[]> {
  const r = await axios.get<{ ok: boolean; filtros: FiltroGuardado[] }>(
    `${BASE_URL}/filtros`, authHeaders()
  )
  return r.data.filtros
}

export async function guardarFiltro(datos: {
  nombre:           string
  estado?:          string
  fecha?:           string
  CodigoOrganismo?: string
  modo?:            string
}): Promise<FiltroGuardado> {
  const r = await axios.post<{ ok: boolean; filtro: FiltroGuardado }>(
    `${BASE_URL}/filtros`, datos, authHeaders()
  )
  return r.data.filtro
}

export async function eliminarFiltro(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/filtros/${id}`, authHeaders())
}