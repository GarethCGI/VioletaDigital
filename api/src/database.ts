import { DataSource } from 'typeorm';
import { Report } from '@/entities/Report';

const isDevelopment = process.env.NODE_ENV !== 'production';
const dbType = process.env.DB_TYPE || 'postgres';

// PostgreSQL configuration
const postgresConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'violeta',
  password: process.env.DB_PASSWORD || 'violeta123',
  database: process.env.DB_NAME || 'violeta_digital',
};

// SQLite configuration (fallback for development)
const sqliteConfig = {
  type: 'better-sqlite3' as const,
  database: process.env.DB_PATH || './data/database.sqlite',
};

export const AppDataSource = new DataSource({
  ...(dbType === 'sqlite' ? sqliteConfig : postgresConfig),
  entities: [Report],
  synchronize: isDevelopment, // Auto-create tables in development
  logging: isDevelopment,
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
}
