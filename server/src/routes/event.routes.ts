import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '../entities/User';

const router = Router();
const eventController = new EventController();

// --- Event CRUD ---
// POST /api/v1/events - Create a new event (requires EDITOR or ADMIN)
router.post(
  '/',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  eventController.createEvent,
);

// GET /api/v1/events - Get all events (public)
router.get('/', eventController.getAllEvents);

// GET /api/v1/events/:id - Get a specific event by ID (public)
router.get('/:id', eventController.getEventById);

// PUT /api/v1/events/:id - Update an event (requires EDITOR or ADMIN)
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  eventController.updateEvent,
);

// DELETE /api/v1/events/:id - Delete an event (requires EDITOR or ADMIN)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  eventController.deleteEvent,
);

// --- Setlist Management for an Event ---

// GET /api/v1/events/:eventId/setlist - Get the setlist for a specific event (public)
router.get('/:eventId/setlist', eventController.getEventSetlist);

// POST /api/v1/events/:eventId/setlist - Add a song to an event's setlist (requires EDITOR or ADMIN)
// Controller's addSongToSetlist expects eventId from params and songId + other details in body via CreateSetlistEntryDto.
router.post(
  '/:eventId/setlist',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  eventController.addSongToSetlist,
);

// DELETE /api/v1/events/:eventId/setlist/songs/:songId - Remove a song from an event's setlist (requires EDITOR or ADMIN)
router.delete(
  '/:eventId/setlist/songs/:songId',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  eventController.removeSongFromSetlist,
);

// PUT /api/v1/events/:eventId/setlist/songs/:songId - Update a song's details in a setlist (requires EDITOR or ADMIN)
router.put(
  '/:eventId/setlist/songs/:songId',
  authMiddleware,
  authorizeRoles(UserRole.EDITOR, UserRole.ADMIN),
  eventController.updateSetlistEntry,
);

export default router;
