import { AppDataSource } from '../config/data-source';
import { Song } from '../entities/Song';
import { User } from '../entities/User'; // Needed if linking createdBy
import { CreateSongDto, UpdateSongDto } from '../dtos/song';
import { Repository, FindManyOptions, Like, FindOptionsWhere } from 'typeorm';
import { HttpException } from '../middlewares/errorHandler';

export interface FindAllSongsQuery {
  page?: number;
  limit?: number;
  title?: string;
  artist?: string;
  genre?: string;
  key?: string;
}

export interface PaginatedSongsResponse {
  data: Song[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SongService {
  private songRepository: Repository<Song>;
  private userRepository: Repository<User>; // If we need to validate created_by_user_id

  constructor() {
    this.songRepository = AppDataSource.getRepository(Song);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createSong(createSongDto: CreateSongDto, userId?: string): Promise<Song> {
    const { title, original_artist, duration_seconds, lyrics, key, genre, audio_url, sheet_music_url } = createSongDto;

    let creator: User | undefined = undefined;
    const actualUserId = userId || createSongDto.created_by_user_id;

    if (actualUserId) {
      creator = await this.userRepository.findOneBy({ id: actualUserId });
      if (!creator && createSongDto.created_by_user_id) { // Only throw if ID was explicitly in DTO and not found
        throw new HttpException(400, `Usuario con ID ${actualUserId} no encontrado. No se puede asignar como creador de la canción.`);
      }
    }

    const newSong = this.songRepository.create({
      title,
      original_artist,
      duration_seconds,
      lyrics,
      key,
      genre,
      audio_url,
      sheet_music_url,
      createdBy: creator, // Assign the User entity instance if found
      created_by_user_id: creator?.id // Explicitly set the ID if creator exists
    });

    return this.songRepository.save(newSong);
  }

  async getAllSongs(query: FindAllSongsQuery): Promise<PaginatedSongsResponse> {
    const { page = 1, limit = 10, title, artist, genre, key: songKey } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Song> = {};
    if (title) where.title = Like(`%${title}%`);
    if (artist) where.original_artist = Like(`%${artist}%`);
    if (genre) where.genre = Like(`%${genre}%`);
    if (songKey) where.key = Like(`%${songKey}%`);

    const findOptions: FindManyOptions<Song> = {
      where,
      skip,
      take: limit,
      order: { title: 'ASC' }, // Default order
      relations: ['createdBy'], // Include creator details, customize as needed
    };

    const [songs, total] = await this.songRepository.findAndCount(findOptions);

    // Omit password from createdBy user before sending response
    const songsCleaned = songs.map(song => {
        if (song.createdBy) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, ...userWithoutPassword } = song.createdBy;
            song.createdBy = userWithoutPassword as User;
        }
        return song;
    });

    return {
      data: songsCleaned,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSongById(id: string): Promise<Song | null> {
    const song = await this.songRepository.findOne({
        where: { id },
        relations: ['createdBy'] // Include relation data
    });

    if (!song) {
      throw new HttpException(404, 'Canción no encontrada.');
    }

    if (song.createdBy) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...userWithoutPassword } = song.createdBy;
        song.createdBy = userWithoutPassword as User;
    }

    return song;
  }

  async updateSong(id: string, updateSongDto: UpdateSongDto): Promise<Song> {
    // First, try to preload the entity to ensure it exists and to get its current state
    const songToUpdate = await this.songRepository.preload({
      id, // The ID of the song to load
      ...updateSongDto, // The new values to apply
    });

    if (!songToUpdate) {
      throw new HttpException(404, 'Canción no encontrada para actualizar.');
    }

    // If created_by_user_id is part of UpdateSongDto and needs validation or specific handling:
    // if (updateSongDto.created_by_user_id) {
    //   const creator = await this.userRepository.findOneBy({ id: updateSongDto.created_by_user_id });
    //   if (!creator) {
    //     throw new HttpException(400, `Usuario creador con ID ${updateSongDto.created_by_user_id} no encontrado.`);
    //   }
    //   songToUpdate.createdBy = creator;
    //   songToUpdate.created_by_user_id = creator.id;
    // } else if (updateSongDto.hasOwnProperty('created_by_user_id') && updateSongDto.created_by_user_id === null) {
    //   // If you want to allow unsetting the creator
    //   songToUpdate.createdBy = undefined; // or null, depending on your entity definition
    //   songToUpdate.created_by_user_id = undefined; // or null
    // }

    // Save the preloaded and updated entity
    const updatedSong = await this.songRepository.save(songToUpdate);

    // Re-fetch with relations if they are not automatically included by save or if you need specific ones
    // This might be redundant if `save` returns the entity with relations already populated as needed.
    const resultWithRelations = await this.getSongById(updatedSong.id);
    if (!resultWithRelations) {
        throw new HttpException(500, 'Error al obtener la canción actualizada con relaciones.');
    }
    return resultWithRelations;
  }


  async deleteSong(id: string): Promise<void> {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) {
      throw new HttpException(404, 'Canción no encontrada para eliminar.');
    }
    const result = await this.songRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(404, 'Canción no encontrada, no se pudo eliminar.');
    }
  }
}
