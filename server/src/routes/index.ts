import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';
import songRoutes from './song.routes';
import memberRoutes from './member.routes';
import eventRoutes from './event.routes';
// import authRoutes from './auth.routes'; // To be added later

const router = Router();

// API Health Check (already in src/index.ts, but can be here too if preferred)
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy and running.',
    timestamp: new Date().toISOString(),
    version: '1.0.0' // Consider reading from package.json
  });
});

// Mount entity-specific routes
router.use('/users', userRoutes);
router.use('/songs', songRoutes);
router.use('/members', memberRoutes);
router.use('/events', eventRoutes);
// router.use('/auth', authRoutes); // For login, register (if separate from user creation), etc.

// Fallback for unhandled API routes
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

export default router;
