import { Router, Request, Response } from 'express'
import { registrar, login }          from '../services/auth.service'
import { verificarToken }            from '../middleware/auth.middleware'

const router = Router()

// POST /api/auth/register
// Body: { email, password, nombre }
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nombre } = req.body

    if (!email || !password || !nombre) {
      res.status(400).json({ ok: false, mensaje: 'email, password y nombre son obligatorios' })
      return
    }
    if (password.length < 6) {
      res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    const resultado = await registrar(email, password, nombre)
    res.status(201).json({ ok: true, ...resultado })

  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al registrar usuario'
    res.status(400).json({ ok: false, mensaje })
  }
})

// POST /api/auth/login
// Body: { email, password }
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ ok: false, mensaje: 'email y password son obligatorios' })
      return
    }

    const resultado = await login(email, password)
    res.json({ ok: true, ...resultado })

  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión'
    res.status(401).json({ ok: false, mensaje })
  }
})

// GET /api/auth/me  — ruta protegida de prueba
router.get('/me', verificarToken, (req: Request, res: Response) => {
  res.json({ ok: true, usuario: req.user })
})

export default router
