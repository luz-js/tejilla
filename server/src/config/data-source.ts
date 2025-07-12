import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Song } from '../entities/Song';
import { Member } from '../entities/Member';
import { Event } from '../entities/Event';
import { SetlistEntry } from '../entities/SetlistEntry';

// Construct the path to the .env file.
// process.cwd() gives the root of the project where package.json is.
// If server is a subdirectory, .env might be in process.cwd() or process.cwd() + '/server'
// For TypeORM CLI, it's often run from the root of the monorepo or project,
// so process.cwd() should point to the directory containing the `server` folder.
// If your .env file is inside the `server` folder, you might need:
// dotenv.config({ path: __dirname + '/../../.env' }); // if .env is in server/
// Or ensure your TypeORM CLI script correctly sets the CWD or loads .env from the correct path.
// For simplicity, assuming .env is at the project root (parent of 'server' directory)
// or that scripts running typeorm cli handle .env loading.
// If server/package.json is the main one for backend, then .env in server/ is fine.
dotenv.config({ path: process.env.ENV_FILE_PATH || (process.cwd() + '/server/.env') });


export const dataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE as any) || 'postgres', // 'postgres' is a safe default
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.NODE_ENV === 'development', // NEVER true in production
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  entities: [User, Song, Member, Event, SetlistEntry], // Direct entity references
  // Or using path strings if preferred, ensure paths are correct relative to dist/config after compilation:
  // entities: [__dirname + '/../entities/**/*.{ts,js}'],
  migrations: [__dirname + '/../migrations/**/*.{ts,js}'],
  subscribers: [__dirname + '/../subscribers/**/*.{ts,js}'],
  migrationsTableName: 'migrations_history',
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
};

export const AppDataSource = new DataSource(dataSourceOptions);
