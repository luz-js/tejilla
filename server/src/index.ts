import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import mainRoutes from './routes'; // Import the main router from routes/index.ts
import { globalErrorHandler } from './middlewares/errorHandler'; // Import the global error handler

// Load environment variables
// Ensure .env from the server folder is loaded. If your script runs from the root, this path is correct.
// If your `npm run dev` or similar script `cd`s into `server/` first, then `dotenv.config()` is enough.
dotenv.config({ path: __dirname + '/../.env' });


const main = async () => {
  try {
    // Initialize TypeORM connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('PostgreSQL Connected using AppDataSource');
    } else {
      console.log('AppDataSource already initialized.');
    }

    const app: Application = express();
    const port = process.env.PORT || 5000;
    const apiBase = process.env.API_BASE_PATH || '/api/v1';

    // Middlewares
    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Your frontend URL
      credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Logging middleware (optional)
    app.use((req, _res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      if (Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
      }
      next();
    });

    // Mount main API routes
    app.use(apiBase, mainRoutes);
    console.log(`API routes mounted under ${apiBase}`);

    // Global Error Handler Middleware - Must be the last middleware
    app.use(globalErrorHandler);

    // Start server
    app.listen(port, () => {
      console.log(`Server is alive and listening on port ${port}`);
      console.log(`API available at http://localhost:${port}${apiBase}`);
      console.log(`Try http://localhost:${port}${apiBase}/health for a health check.`);
    });

  } catch (error) {
    console.error('Error during Data Source initialization or server startup:', error);
    process.exit(1);
  }
};

main().catch((err) => {
  console.error('Failed to start server due to unhandled promise rejection:', err);
  process.exit(1);
});
