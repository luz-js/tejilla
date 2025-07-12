import { Request, Response, NextFunction } from 'express';
import { EventService, FindAllEventsQuery } from '../services/event.service';
import { CreateEventDto, UpdateEventDto } from '../dtos/event';
import { CreateSetlistEntryDto as StandaloneCreateSetlistEntryDto } from '../dtos/setlist'; // For adding individual songs
import { validate } from 'class-validator';
import { HttpException } from '../middlewares/errorHandler';
import { plainToClass } from 'class-transformer';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  public createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createEventDto = plainToClass(CreateEventDto, req.body);
      const errors = await validate(createEventDto);

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al crear evento.', errors);
      }

      // const userId = (req as any).user?.id; // If auth is implemented
      const event = await this.eventService.createEvent(createEventDto /*, userId */);
      res.status(201).json({ data: event, message: 'Evento creado exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const includeSetlist = req.query.includeSetlist === 'true';
      const queryParams: FindAllEventsQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        title: req.query.title as string | undefined,
        venueName: req.query.venueName as string | undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
        isPublic: req.query.isPublic !== undefined ? (req.query.isPublic === 'true') : undefined,
      };

      if (queryParams.page !== undefined && (isNaN(queryParams.page) || queryParams.page < 1)) {
        throw new HttpException(400, 'Parámetro de página inválido.');
      }
      if (queryParams.limit !== undefined && (isNaN(queryParams.limit) || queryParams.limit < 1)) {
        throw new HttpException(400, 'Parámetro de límite inválido.');
      }
      // Add validation for dateFrom/dateTo if needed (e.g., valid date format)

      const paginatedResult = await this.eventService.getAllEvents(queryParams, includeSetlist);
      res.status(200).json({ ...paginatedResult, message: 'Eventos obtenidos exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = req.params.id;
      if (!eventId) {
        throw new HttpException(400, 'ID de evento no proporcionado.');
      }
      const includeSetlist = req.query.includeSetlist === 'true';
      const event = await this.eventService.getEventById(eventId, includeSetlist);
      res.status(200).json({ data: event, message: 'Evento obtenido exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = req.params.id;
      if (!eventId) {
        throw new HttpException(400, 'ID de evento no proporcionado.');
      }

      const updateEventDto = plainToClass(UpdateEventDto, req.body);
      const errors = await validate(updateEventDto);

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al actualizar evento.', errors);
      }

      if (Object.keys(updateEventDto).length === 0) {
        throw new HttpException(400, 'El cuerpo de la solicitud no puede estar vacío para la actualización.');
      }

      const updatedEvent = await this.eventService.updateEvent(eventId, updateEventDto);
      res.status(200).json({ data: updatedEvent, message: 'Evento actualizado exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = req.params.id;
      if (!eventId) {
        throw new HttpException(400, 'ID de evento no proporcionado.');
      }
      await this.eventService.deleteEvent(eventId);
      res.status(200).json({ message: 'Evento eliminado exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  // --- Setlist specific controller methods ---

  public addSongToSetlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { eventId, songId } = req.params; // Assuming songId is also in params, or it's in body
      if (!eventId || !songId) {
        throw new HttpException(400, 'IDs de evento y canción son requeridos.');
      }

      // If orderInSetlist and notes come from body:
      const createSetlistEntryDto = plainToClass(StandaloneCreateSetlistEntryDto, { ...req.body, eventId, songId });
      const errors = await validate(createSetlistEntryDto);
      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al añadir canción al setlist.', errors);
      }

      const setlistEntry = await this.eventService.addSongToSetlist(eventId, createSetlistEntryDto);
      res.status(201).json({ data: setlistEntry, message: 'Canción añadida al setlist exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public removeSongFromSetlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { eventId, songId } = req.params; // Or setlistEntryId if preferred
      if (!eventId || !songId) {
        throw new HttpException(400, 'IDs de evento y canción son requeridos para eliminar del setlist.');
      }
      await this.eventService.removeSongFromSetlist(eventId, songId);
      res.status(200).json({ message: 'Canción eliminada del setlist exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public updateSetlistEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { eventId, songId } = req.params; // Or setlistEntryId
      const { orderInSetlist, notes } = req.body;

      if (!eventId || !songId) {
        throw new HttpException(400, 'IDs de evento y canción son requeridos.');
      }
      if (orderInSetlist === undefined && notes === undefined) {
        throw new HttpException(400, 'Debe proporcionar un nuevo orden o nuevas notas para actualizar.');
      }
      if (orderInSetlist !== undefined && (typeof orderInSetlist !== 'number' || orderInSetlist < 1)) {
        throw new HttpException(400, 'El nuevo orden debe ser un número positivo.');
      }

      const updatedEntry = await this.eventService.updateSetlistEntryOrder(eventId, songId, orderInSetlist, notes);
      res.status(200).json({ data: updatedEntry, message: 'Entrada del setlist actualizada exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getEventSetlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        throw new HttpException(400, 'ID de evento no proporcionado.');
      }
      const setlist = await this.eventService.getEventSetlist(eventId);
      res.status(200).json({ data: setlist, message: 'Setlist del evento obtenido exitosamente.' });
    } catch (error) {
      next(error);
    }
  };
}
