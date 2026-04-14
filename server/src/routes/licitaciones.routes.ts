import { Router, Request, Response } from 'express'
import { getLicitaciones, getLicitacionPorCodigo } from '../services/chilecompra.service'
import { FiltrosLicitacion } from '../types/chilecompra.types'
import { calcularScore }     from '../services/score.service'
import { calcularScoreLista } from '../services/scorepyme.service'  // ← nuevo

const router = Router()

// GET /api/licitaciones
// Devuelve licitaciones con filtros opcionales
//
// Query params opcionales:
//   ?fecha=04042026
//   ?estado=activas
//   ?CodigoOrganismo=6945
//   ?CodigoProveedor=17793
//   ?modo=pyme          ← nuevo: usa algoritmo PYME y ordena por score
router.get('/', async (req: Request, res: Response) => {

  try {
    const modo = req.query.modo as string | undefined  // ← nuevo

    const filtros: FiltrosLicitacion = {
      fecha:           req.query.fecha           as string | undefined,
      estado:          req.query.estado          as string | undefined,
      CodigoOrganismo: req.query.CodigoOrganismo as string | undefined,
      CodigoProveedor: req.query.CodigoProveedor as string | undefined,
    }

    const filtrosLimpios = Object.fromEntries(
      Object.entries(filtros).filter(([_, v]) => v !== undefined)
    ) as FiltrosLicitacion

    console.log('Consultando licitaciones con filtros:', filtrosLimpios, '| modo:', modo ?? 'general')

    const resultado = await getLicitaciones(filtrosLimpios)

    // ← actualizado: elegir algoritmo según modo
    const licitacionesConScore = modo === 'pyme'
      ? calcularScoreLista(resultado.Listado)        // PYME: ordena de mayor a menor score
      : resultado.Listado.map(lic => ({
          ...lic,
          score: calcularScore(lic)
        }))

    res.json({
      ok: true,
      cantidad: resultado.Cantidad,
      fechaConsulta: resultado.FechaCreacion,
      licitaciones: licitacionesConScore
    })

  } catch (error) {
    console.error(' Error en GET /api/licitaciones:', error)
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener licitaciones',
      detalle: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

// GET /api/licitaciones/:codigo
// Ejemplo: GET http://localhost:3000/api/licitaciones/1509-5-L114
router.get('/:codigo', async (req: Request, res: Response) => {

  // String() para evitar errores de tipo "string | string[]"
  const codigo = String(req.params.codigo)

  try {
    console.log(`Buscando licitación con código: ${codigo}`)

    const licitacion = await getLicitacionPorCodigo(codigo)

    if (!licitacion) {
      res.status(404).json({
        ok: false,
        mensaje: `No se encontró la licitación con código: ${codigo}`
      })
      return
    }

    res.json({
      ok: true,
      licitacion
    })

  } catch (error) {
    console.error(`Error en GET /api/licitaciones/${codigo}:`, error)
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener la licitación',
      detalle: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})

export default router