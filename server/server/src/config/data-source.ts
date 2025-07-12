import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env' }); // Ensure .env is loaded from project root for CLI

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.NODE_ENV === 'development', // NEVER true in production
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  entities: [__dirname + '/../entities/**/*.{ts,js}'],
  migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
  subscribers: [__dirname + '/../subscribers/**/*.{ts,js}'],
  migrationsTableName: 'migrations_history', // Optional: custom name for migrations table
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, // Example for Heroku/Render
};

export const AppDataSource = new DataSource(dataSourceOptions);
