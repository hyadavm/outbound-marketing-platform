import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5001,
  jwtSecret: process.env.JWT_SECRET || 'outbound-marketing-super-secret-key-2026',
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'outbound_marketing',
    port: Number(process.env.DB_PORT) || 3306
  }
};
