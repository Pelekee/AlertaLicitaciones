import axios from 'axios'
import {
  RespuestaLicitaciones,
  Licitacion,
  FiltrosLicitacion
} from '../types/chilecompra.types'

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

  try {
    const respuesta = await axios.get<RespuestaLicitaciones>(
      `${BASE_URL}/licitaciones.json`,
      { params }
    )

    return respuesta.data

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status  = error.response?.status
      const mensaje = error.response?.data
      console.error(`Error al consultar ChileCompra [${status}]:`, mensaje)
      throw new Error(`Error al consultar la API de ChileCompra: ${status}`)
    }
    throw error
  }
}

// Función auxiliar: obtener una licitación por su código
export async function getLicitacionPorCodigo(
  codigo: string
): Promise<Licitacion | null> {

  try {
    const respuesta = await getLicitaciones({ codigo })

    if (respuesta.Listado && respuesta.Listado.length > 0) {
      return respuesta.Listado[0]
    }

    return null

  } catch (error) {
    console.error(`Error al buscar licitación ${codigo}:`, error)
    throw error
  }
}