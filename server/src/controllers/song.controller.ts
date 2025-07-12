import { Request, Response, NextFunction } from 'express';
import { SongService, FindAllSongsQuery } from '../services/song.service';
import { CreateSongDto, UpdateSongDto } from '../dtos/song';
import { validate } from 'class-validator';
import { HttpException } from '../middlewares/errorHandler';
import { plainToClass } from 'class-transformer';

export class SongController {
  private songService: SongService;

  constructor() {
    this.songService = new SongService();
  }

  public createSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createSongDto = plainToClass(CreateSongDto, req.body);
      const errors = await validate(createSongDto);

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al crear canción.', errors);
      }

      // Assuming authenticated user's ID might be available in req.user.id via auth middleware
      // const userId = (req as any).user?.id; // Adjust if user ID comes from elsewhere
      // For now, created_by_user_id is optional in DTO or handled by service if no auth yet.

      const song = await this.songService.createSong(createSongDto /*, userId */);
      res.status(201).json({ data: song, message: 'Canción creada exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getAllSongs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse query parameters for pagination and filtering
      const queryParams: FindAllSongsQuery = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        title: req.query.title as string | undefined,
        artist: req.query.artist as string | undefined,
        genre: req.query.genre as string | undefined,
        key: req.query.key as string | undefined,
      };

      // Validate page and limit if necessary (e.g., ensure they are numbers, within range)
      if (queryParams.page !== undefined && (isNaN(queryParams.page) || queryParams.page < 1)) {
        throw new HttpException(400, 'Parámetro de página inválido.');
      }
      if (queryParams.limit !== undefined && (isNaN(queryParams.limit) || queryParams.limit < 1)) {
        throw new HttpException(400, 'Parámetro de límite inválido.');
      }

      const paginatedResult = await this.songService.getAllSongs(queryParams);
      res.status(200).json({ ...paginatedResult, message: 'Canciones obtenidas exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getSongById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const songId = req.params.id;
      if (!songId) {
        throw new HttpException(400, 'ID de canción no proporcionado.');
      }
      const song = await this.songService.getSongById(songId);
      res.status(200).json({ data: song, message: 'Canción obtenida exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public updateSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const songId = req.params.id;
      if (!songId) {
        throw new HttpException(400, 'ID de canción no proporcionado.');
      }

      const updateSongDto = plainToClass(UpdateSongDto, req.body);
      const errors = await validate(updateSongDto); // Add { skipMissingProperties: true } for partial updates

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al actualizar canción.', errors);
      }

      if (Object.keys(updateSongDto).length === 0) {
        throw new HttpException(400, 'El cuerpo de la solicitud no puede estar vacío para la actualización.');
      }

      const updatedSong = await this.songService.updateSong(songId, updateSongDto);
      res.status(200).json({ data: updatedSong, message: 'Canción actualizada exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const songId = req.params.id;
      if (!songId) {
        throw new HttpException(400, 'ID de canción no proporcionado.');
      }
      await this.songService.deleteSong(songId);
      res.status(200).json({ message: 'Canción eliminada exitosamente.' }); // Or 204 No Content
    } catch (error) {
      next(error);
    }
  };
}
