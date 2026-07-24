import './loadEnv.js'
import { createApp } from './app.js'
import { testConnection, pool } from './db/pool.js'

async function startServer() {
  try {
    await testConnection()
    console.log(`Database connected: ${process.env.DB_NAME}`)

    const app = createApp()
    const port = Number(process.env.PORT ?? 3000)

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
      console.log(`Health check: http://localhost:${port}/api/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    await pool.end()
    process.exit(1)
  }
}

startServer()
