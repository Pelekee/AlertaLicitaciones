import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Extiende el tipo Request de Express para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string }
    }
  }
}

// Verifica el JWT del header Authorization: Bearer <token>
export function verificarToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, mensaje: 'Token no proporcionado' })
    return
  }

  const token  = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET

  if (!secret) {
    res.status(500).json({ ok: false, mensaje: 'Configuración de servidor incompleta' })
    return
  }

  try {
    const payload = jwt.verify(token, secret) as { userId: string; email: string }
    req.user = payload
    next()
  } catch {
    res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' })
  }
}
