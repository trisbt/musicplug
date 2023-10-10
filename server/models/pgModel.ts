import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fetchSecrets } from '../secrets';
// change HOST to HOST_DEV for development
dotenv.config();

// const pool = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST_DEV,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: Number(process.env.PG_PORT),
//   ssl: { rejectUnauthorized: false }
// });

let pool: Pool;

async function connectToDb() {
  try {
    const secrets = await fetchSecrets();
    const { username, password, engine, host, port } = secrets.postgres;
    pool = new Pool({
      user: username,  // Generally, the user for PostgreSQL is 'postgres'. However, verify this.
      host: host,
      database: engine,  // Here, the database name is taken from 'username'.
      password: password,
      port: Number(port),
      ssl: { rejectUnauthorized: false }
    });

    return pool;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}


export const query = (text: string, params: any[], callback: (err: Error, result: any) => void) => {
  if (!pool) {
    throw new Error('Database pool is not initialized. Please ensure connectToDb is called first.');
  }

  return pool.query(text, params, callback);
};

// Automatically call connectToDb upon importing this module. This ensures the pool is set up right away.
connectToDb().catch(err => {
  console.error('Error initializing database pool:', err);
});