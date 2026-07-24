import { pool } from './pool.js'
import { schemaSql } from './schema.js'
import { seedDatabase } from './seed.js'

export async function initDatabase() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    await client.query(schemaSql)

    const seeded = await seedDatabase(client)
    await client.query('COMMIT')

    if (seeded) {
      console.log('Database initialized with seed data')
    } else {
      console.log('Database schema ready (existing data preserved)')
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
