import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: 'postgres',
  host: 'localhost',
  database: 'ptud', 
  password: '123456', 
  port: 5432,
})

export const query = (text: string, params?: any[]) => pool.query(text, params)

