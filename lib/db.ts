import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER || 'letranhoailoc',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'manufacturing_db', 
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export const query = (text: string, params?: any[]) => pool.query(text, params)
