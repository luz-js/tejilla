import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import cors from 'cors';

dotenv.config();

const main = async () => {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL Connected using AppDataSource');

    const app = express();
    const port = process.env.PORT || 5000;

    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    }));
    app.use(express.json());

    app.get('/api/health', (_, res) => {
      res.json({ message: 'Server is healthy', timestamp: new Date().toISOString(), version: '1.0' });
    });

    // Routes will be added here
    // e.g., import songRoutes from './routes/songRoutes';
    // app.use('/api/songs', songRoutes);

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Error during Data Source initialization or server startup:', error);
  }
};

main().catch((err) => {
  console.error('Failed to start server:', err);
});
