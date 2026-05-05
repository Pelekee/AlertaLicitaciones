import { Router, Request, Response } from 'express'
import { PrismaClient }              from '@prisma/client'
import { verificarToken }            from '../middleware/auth.middleware'

const router = Router()
const prisma = new PrismaClient()

// Todas las rutas requieren autenticación
router.use(verificarToken)

// GET /api/filtros — lista los filtros del usuario autenticado
router.get('/', async (req: Request, res: Response) => {
  try {
    const filtros = await prisma.filtroGuardado.findMany({
      where:   { userId: req.user!.userId },
      orderBy: { creadoEn: 'desc' }
    })
    res.json({ ok: true, filtros })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar filtros' })
  }
})

// POST /api/filtros — guarda un filtro nuevo
// Body: { nombre, estado?, fecha?, CodigoOrganismo?, modo? }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nombre, estado, fecha, CodigoOrganismo, modo } = req.body

    if (!nombre || nombre.trim().length === 0) {
      res.status(400).json({ ok: false, mensaje: 'El nombre del filtro es obligatorio' })
      return
    }

    const filtro = await prisma.filtroGuardado.create({
      data: {
        userId: req.user!.userId,
        nombre: nombre.trim(),
        estado:          estado          || null,
        fecha:           fecha           || null,
        CodigoOrganismo: CodigoOrganismo || null,
        modo:            modo            || null,
      }
    })
    res.status(201).json({ ok: true, filtro })

  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al guardar el filtro' })
  }
})

// DELETE /api/filtros/:id — elimina un filtro propio
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id)

    // Solo permite borrar si pertenece al usuario
    const filtro = await prisma.filtroGuardado.findUnique({ where: { id } })
    if (!filtro || filtro.userId !== req.user!.userId) {
      res.status(404).json({ ok: false, mensaje: 'Filtro no encontrado' })
      return
    }

    await prisma.filtroGuardado.delete({ where: { id } })
    res.json({ ok: true })

  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar el filtro' })
  }
})

export default router
