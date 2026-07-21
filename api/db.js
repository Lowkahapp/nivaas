import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nivaas',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function getOne(text, params) {
  const result = await pool.query(text, params);
  return result.rows[0];
}

export async function getAll(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}

export async function run(text, params) {
  const result = await pool.query(text, params);
  return result.rowCount;
}
