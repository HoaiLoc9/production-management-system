import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // hoặc thông số riêng
  user: 'postgres',      // user PostgreSQL của bạn
  host: 'localhost',
  database: 'manufacturing_db',
  password: '123456',          // điền password nếu có
  port: 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);