import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: 'letranhoailoc',
  host: 'localhost',
  database: 'manufacturing_db', 
  password: '', 
  port: 5432,
})

export const query = (text: string, params?: any[]) => pool.query(text, params)
