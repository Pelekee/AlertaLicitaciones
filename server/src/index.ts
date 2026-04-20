import express     from 'express'
import cors        from 'cors'
import dotenv      from 'dotenv'

import licitacionesRouter from './routes/licitaciones.routes'
import authRouter         from './routes/auth.routes'  // ← nuevo

// Cargar variables de entorno
dotenv.config()
console.log('\nPruebas de variables de entorno:')
console.log(' BASE_URL:', process.env.CHILECOMPRA_BASE_URL)
console.log(' TICKET:', process.env.CHILECOMPRA_TICKET ? 'Encontrado' : 'No encontrado')

// Crear la aplicación Express
const app  = express()
const PORT = process.env.PORT || 3000

// Configuración de CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // ← nuevo: permite header JWT
}))

// express.json(): permite leer el body de peticiones POST como JSON
app.use(express.json())

// Rutas
app.use('/api/licitaciones', licitacionesRouter)
app.use('/api/auth',         authRouter)  // ← nuevo

// verificar que esta funcionando y corriendo correctamente http://localhost:3000/api/prueba
app.get('/api/prueba', (_req, res) => {
  res.json({
    ok: true,
    mensaje: 'Servidor Alerta Licitaciones funcionando',
    timestamp: new Date().toISOString()
  })
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('')
  console.log('   Alerta Licitaciones — Servidor iniciado')
  console.log(`   URL: http://localhost:${PORT}`)
  console.log(`   Prueba: http://localhost:${PORT}/api/prueba`)
  console.log(`   Licitaciones: http://localhost:${PORT}/api/licitaciones`)
  console.log('')
})
