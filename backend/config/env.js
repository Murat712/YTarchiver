export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || '7d';

const necessaryEnvironments = {
  PORT,
  DB_URI,
  JWT_SECRET_KEY,
};

const missing = Object.entries(necessaryEnvironments)
  .filter(([name, value]) => value === undefined || value === '')
  .map(([name]) => name);

if (missing.length > 0) {
  missing.forEach((name) => console.error(`${name} is not defined`));
  process.exit(1);
}
