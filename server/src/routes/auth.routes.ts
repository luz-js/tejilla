import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // Import authMiddleware

const router = Router();
const authController = new AuthController();

// POST /api/v1/auth/register - User registration
router.post('/register', authController.register);

// POST /api/v1/auth/login - User login
router.post('/login', authController.login);

// GET /api/v1/auth/me - Get authenticated user's details
// This route will require authentication middleware.
router.get('/me', authMiddleware, authController.getMe); // Protected

// Optional: Logout route
// router.post('/logout', authMiddleware, authController.logout); // Protected

export default router;
