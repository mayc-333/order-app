function shouldUseSsl() {
  if (process.env.DB_SSL === 'true') {
    return true
  }

  const host = process.env.DB_HOST ?? ''
  const databaseUrl = process.env.DATABASE_URL ?? ''

  return (
    host.includes('render.com') ||
    databaseUrl.includes('render.com') ||
    databaseUrl.includes('sslmode=require')
  )
}

export function getDbConfig(overrides = {}) {
  const ssl = shouldUseSsl() ? { rejectUnauthorized: false } : undefined

  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl,
      ...overrides,
    }
  }

  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl,
    ...overrides,
  }
}
