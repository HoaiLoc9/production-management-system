// lib/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', 
  password: '123456', // đúng password bạn vừa đặt trong psql
  port: 5432,
});
