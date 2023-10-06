import { Pool } from 'pg';
import dotenv from 'dotenv';

// change HOST to HOST_DEV for development
dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST_DEV,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
  ssl: { rejectUnauthorized: false }
});

export const query = (text: string, params: any[], callback: (err: Error, result: any) => void) => {
  // console.log('Executed query', text);
  return pool.query(text, params, callback);
};