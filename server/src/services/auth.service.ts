import { PrismaClient }  from '@prisma/client'
import bcrypt            from 'bcryptjs'
import jwt               from 'jsonwebtoken'

const prisma = new PrismaClient()

// Genera un JWT firmado con el userId y email
function generarToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET no está definido en .env')

  return jwt.sign(
    { userId, email },
    secret,
    { expiresIn: '7d' }
  )
}

// Crea un usuario nuevo y devuelve el token
export async function registrar(email: string, password: string, nombre: string) {
  const emailNorm = email.toLowerCase().trim()

  const existe = await prisma.user.findUnique({ where: { email: emailNorm } })
  if (existe) throw new Error('Ya existe una cuenta con ese correo')

  const hash   = await bcrypt.hash(password, 10)
  const usuario = await prisma.user.create({
    data: { email: emailNorm, password: hash, nombre }
  })

  const token = generarToken(usuario.id, usuario.email)
  return { token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } }
}

// Verifica credenciales y devuelve el token
export async function login(email: string, password: string) {
  const emailNorm = email.toLowerCase().trim()

  const usuario = await prisma.user.findUnique({ where: { email: emailNorm } })
  if (!usuario) throw new Error('Correo o contraseña incorrectos')

  const coincide = await bcrypt.compare(password, usuario.password)
  if (!coincide) throw new Error('Correo o contraseña incorrectos')

  const token = generarToken(usuario.id, usuario.email)
  return { token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } }
}
