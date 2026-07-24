import '../src/loadEnv.js'
import pg from 'pg'
import { getDbConfig } from '../src/db/config.js'
import { initDatabase } from '../src/db/init.js'
import { pool } from '../src/db/pool.js'

const { Client } = pg

async function ensureDatabaseExists() {
  const dbName = process.env.DB_NAME

  if (!dbName) {
    throw new Error('DB_NAME is not set in .env')
  }

  const adminClient = new Client(
    getDbConfig({
      database: 'postgres',
    }),
  )

  await adminClient.connect()

  try {
    const exists = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName],
    )

    if (exists.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`)
      console.log(`Database created: ${dbName}`)
    } else {
      console.log(`Database already exists: ${dbName}`)
    }
  } finally {
    await adminClient.end()
  }
}

async function main() {
  await ensureDatabaseExists()
  await initDatabase()
  await pool.end()
  console.log('Database setup complete')
}

main().catch((error) => {
  console.error('Database setup failed:', error.message)
  process.exit(1)
})
