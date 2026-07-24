import pg from 'pg'
import { getDbConfig } from './config.js'

const { Pool } = pg

export const pool = new Pool(getDbConfig())

export async function testConnection() {
  const result = await pool.query('SELECT NOW() AS connected_at')
  return result.rows[0]
}
