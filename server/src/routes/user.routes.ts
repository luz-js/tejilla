import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '../entities/User'; // For UserRole enum

const router = Router();
const userController = new UserController();

// POST /api/v1/users - Admin creates a user (Registration is via /auth/register)
router.post(
  '/',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  userController.createUser,
);

// GET /api/v1/users - Admin gets all users
router.get(
  '/',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  userController.getAllUsers,
);

// GET /api/v1/users/:id - Admin gets any user by ID. User gets their own details (handled by /auth/me).
// If a user needs to get another user's public profile (not implemented yet), this might change.
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN), // Only admin can get arbitrary user by ID for now
  userController.getUserById,
);

// PUT /api/v1/users/:id - Admin updates any user. User updates their own details.
// For user updating their own, they should ideally use a dedicated /auth/me/update or similar endpoint.
// Or, we add logic here to check if req.user.id === req.params.id.
router.put(
  '/:id',
  authMiddleware,
  // Simple approach: Only admin can update any user through this generic endpoint.
  // Users update themselves via a potential /auth/me or similar.
  // More complex: authorizeRoles(UserRole.ADMIN) or (if req.user.id === req.params.id && UserRole.LECTOR, UserRole.EDITOR etc.)
  authorizeRoles(UserRole.ADMIN), // For now, only Admin can update via this route
  userController.updateUser,
);
// TODO: Add a route for a user to update their own details, e.g., PUT /auth/me

// DELETE /api/v1/users/:id - Admin deletes a user
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  userController.deleteUser,
);

export default router;
