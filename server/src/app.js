import express from 'express'
import cors from 'cors'
import { testConnection } from './db/pool.js'

export function createApp() {
  const app = express()

  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

  app.use(
    cors({
      origin: corsOrigin,
    }),
  )
  app.use(express.json())

  app.get('/', (_req, res) => {
    res.json({
      name: 'COZY Coffee Order API',
      message: 'API 서버가 실행 중입니다. 화면(UI)은 프론트엔드에서 확인하세요.',
      frontend: corsOrigin,
      endpoints: {
        health: '/api/health',
      },
    })
  })

  app.get('/api/health', async (_req, res) => {
    try {
      const db = await testConnection()

      res.json({
        status: 'ok',
        message: 'COZY coffee order API server is running',
        database: 'connected',
        connectedAt: db.connected_at,
      })
    } catch (error) {
      res.status(503).json({
        status: 'error',
        message: 'Database connection failed',
        database: 'disconnected',
        error: error.message,
      })
    }
  })

  return app
}
