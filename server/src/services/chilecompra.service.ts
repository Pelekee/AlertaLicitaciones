import axios from 'axios'
import {
  RespuestaLicitaciones,
  Licitacion,
  FiltrosLicitacion
} from '../types/chilecompra.types'

// cache en memoria por código de licitación
// Evita golpear ChileCompra cada vez que el usuario abre/vuelve a una licitación
const TTL_MS = 10 * 60 * 1000  // 10 minutos
const cacheDetalle = new Map<string, { data: Licitacion; expiraEn: number }>()

// ← nuevo: helper de espera para reintento
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// obtener licitaciones
export async function getLicitaciones(
  filtros: FiltrosLicitacion = {}
): Promise<RespuestaLicitaciones> {

  const BASE_URL = process.env.CHILECOMPRA_BASE_URL
  const TICKET   = process.env.CHILECOMPRA_TICKET

  // Validación de variables de entorno
  if (!BASE_URL) {
    throw new Error('CHILECOMPRA_BASE_URL no está definida en el archivo .env')
  }
  if (!TICKET) {
    throw new Error('CHILECOMPRA_TICKET no está definido en el archivo .env')
  }

  // Construimos los parámetros de la URL
  const params: Record<string, string> = {
    ticket: TICKET,
    ...filtros
  }

  // Si no viene ningún filtro, pedimos las "activas" por defecto
  if (!filtros.fecha && !filtros.estado && !filtros.codigo) {
    params.estado = 'activas'
  }

  // reintenta hasta 2 veces si ChileCompra responde 429 (rate limit)
  const MAX_INTENTOS = 3
  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    try {
      const respuesta = await axios.get<RespuestaLicitaciones>(
        `${BASE_URL}/licitaciones.json`,
        { params }
      )
      return respuesta.data

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        // 429 = rate limit → esperar y reintentar con backoff
        if (status === 429 && intento < MAX_INTENTOS) {
          const espera = 600 * intento  // 600ms, 1200ms
          console.warn(`ChileCompra 429 (intento ${intento}/${MAX_INTENTOS}), esperando ${espera}ms...`)
          await sleep(espera)
          continue
        }

        const mensaje = error.response?.data
        console.error(`Error al consultar ChileCompra [${status}]:`, mensaje)
        throw new Error(`Error al consultar la API de ChileCompra: ${status}`)
      }
      throw error
    }
  }

  throw new Error('Error al consultar ChileCompra: agotados los reintentos')
}

// Función auxiliar: obtener una licitación por su código
// usa cache en memoria TTL 10 min 
export async function getLicitacionPorCodigo(
  codigo: string
): Promise<Licitacion | null> {

  //Servir desde cache si está vigente
  const enCache = cacheDetalle.get(codigo)
  if (enCache && enCache.expiraEn > Date.now()) {
    return enCache.data
  }

  try {
    const respuesta = await getLicitaciones({ codigo })

    if (respuesta.Listado && respuesta.Listado.length > 0) {
      const licitacion = respuesta.Listado[0]
      //Guardar en cache
      cacheDetalle.set(codigo, { data: licitacion, expiraEn: Date.now() + TTL_MS })
      return licitacion
    }

    return null

  } catch (error) {
    console.error(`Error al buscar licitación ${codigo}:`, error)
    throw error
  }
}