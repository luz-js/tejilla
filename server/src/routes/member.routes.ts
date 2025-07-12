import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '../entities/User';

const router = Router();
const memberController = new MemberController();

// POST /api/v1/members - Create a new member (requires ADMIN)
router.post(
  '/',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  memberController.createMember,
);

// GET /api/v1/members - Get all members (public)
router.get('/', memberController.getAllMembers);

// GET /api/v1/members/:id - Get a specific member by ID (public)
router.get('/:id', memberController.getMemberById);

// PUT /api/v1/members/:id - Update a member (requires ADMIN)
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  memberController.updateMember,
);

// DELETE /api/v1/members/:id - Delete a member (requires ADMIN)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  memberController.deleteMember,
);

export default router;
