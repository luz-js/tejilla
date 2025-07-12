import { Router } from 'express';
import { SongController } from '../controllers/song.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '../entities/User';

const router = Router();
const songController = new SongController();

// POST /api/v1/songs - Create a new song (requires EDITOR or ADMIN)
router.post(
  '/',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  songController.createSong,
);

// GET /api/v1/songs - Get all songs (public)
router.get('/', songController.getAllSongs);

// GET /api/v1/songs/:id - Get a specific song by ID (public)
router.get('/:id', songController.getSongById);

// PUT /api/v1/songs/:id - Update a song (requires EDITOR or ADMIN)
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  songController.updateSong,
);

// DELETE /api/v1/songs/:id - Delete a song (requires EDITOR or ADMIN)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  songController.deleteSong,
);

export default router;
