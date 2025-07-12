import { AppDataSource } from '../config/data-source';
import { Event } from '../entities/Event';
import { User } from '../entities/User';
import { Song } from '../entities/Song';
import { SetlistEntry } from '../entities/SetlistEntry';
import { CreateEventDto, UpdateEventDto } from '../dtos/event'; // UpdateEventSetlistEntryDto is defined within UpdateEventDto or could be imported if separate
import { CreateSetlistEntryDto as StandaloneCreateSetlistEntryDto } from '../dtos/setlist'; // For adding individual songs
import { Repository, FindManyOptions, Like, FindOptionsWhere, In, IsNull, Not, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'; // Added MoreThanOrEqual, LessThanOrEqual
import { HttpException } from '../middlewares/errorHandler';
// import { instanceToPlain } from 'class-transformer'; // Not used currently, can be removed or kept for future

export interface FindAllEventsQuery {
  page?: number;
  limit?: number;
  title?: string;
  venueName?: string;
  dateFrom?: string; // ISO Date string
  dateTo?: string; // ISO Date string
  isPublic?: boolean;
}

export interface PaginatedEventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class EventService {
  private eventRepository: Repository<Event>;
  private userRepository: Repository<User>;
  private songRepository: Repository<Song>;
  private setlistEntryRepository: Repository<SetlistEntry>;

  constructor() {
    this.eventRepository = AppDataSource.getRepository(Event);
    this.userRepository = AppDataSource.getRepository(User);
    this.songRepository = AppDataSource.getRepository(Song);
    this.setlistEntryRepository = AppDataSource.getRepository(SetlistEntry);
  }

  async createEvent(createEventDto: CreateEventDto, userId?: string): Promise<Event> {
    const { title, date, venueName, venueAddress, description, isPublic, setlistEntries: setlistEntriesDto } = createEventDto;

    let creator: User | undefined = undefined;
    const actualUserId = userId || createEventDto.created_by_user_id;

    if (actualUserId) {
      creator = await this.userRepository.findOneBy({ id: actualUserId });
      if (!creator && createEventDto.created_by_user_id) {
        throw new HttpException(400, `Usuario con ID ${actualUserId} no encontrado. No se puede asignar como creador del evento.`);
      }
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newEventPartial: Partial<Event> = {
        title,
        date: new Date(date), // Convert ISO string to Date object
        venueName,
        venueAddress,
        description,
        isPublic: isPublic === undefined ? false : isPublic, // Default to false if not provided
        createdBy: creator,
        created_by_user_id: creator?.id,
      };

      const newEvent = queryRunner.manager.create(Event, newEventPartial);
      const savedEvent = await queryRunner.manager.save(newEvent);

      if (setlistEntriesDto && setlistEntriesDto.length > 0) {
        const setlistEntryEntities: SetlistEntry[] = [];
        for (const entryDto of setlistEntriesDto) {
          const song = await this.songRepository.findOneBy({ id: entryDto.songId });
          if (!song) {
            throw new HttpException(400, `Canción con ID ${entryDto.songId} no encontrada para el setlist.`);
          }
          const newSetlistEntry = this.setlistEntryRepository.create({
            event: savedEvent, // Link to the event being created
            eventId: savedEvent.id,
            song: song,
            songId: song.id,
            orderInSetlist: entryDto.orderInSetlist,
            notes: entryDto.notes,
          });
          setlistEntryEntities.push(newSetlistEntry);
        }
        await queryRunner.manager.save(setlistEntryEntities);
        savedEvent.setlistEntries = setlistEntryEntities; // Attach to the event object being returned
      }

      await queryRunner.commitTransaction();
      // Re-fetch to get relations populated by TypeORM if not automatically handled by save + transaction context
      // For simple cases, savedEvent might be enough, but with transactions and multiple saves, re-fetching is safer.
      return this.getEventById(savedEvent.id, true); // Pass true to fetch with setlist
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      console.error("Error creating event:", error);
      throw new HttpException(500, 'Error al crear el evento.');
    } finally {
      await queryRunner.release();
    }
  }

  async getAllEvents(query: FindAllEventsQuery, includeSetlist: boolean = false): Promise<PaginatedEventsResponse> {
    const { page = 1, limit = 10, title, venueName, dateFrom, dateTo, isPublic } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Event> = {};
    if (title) where.title = Like(`%${title}%`);
    if (venueName) where.venueName = Like(`%${venueName}%`);
    if (typeof isPublic === 'boolean') where.isPublic = isPublic;
    // Date filtering can be more complex, e.g., using Between or Raw SQL for specific date parts
    // For simplicity, basic date range:
    if (dateFrom) where.date = MoreThanOrEqual(new Date(dateFrom)); // Requires import from typeorm
    if (dateTo) where.date = LessThanOrEqual(new Date(dateTo)); // Requires import from typeorm

    const relationsToLoad = ['createdBy'];
    if (includeSetlist) {
      relationsToLoad.push('setlistEntries', 'setlistEntries.song');
    }

    const findOptions: FindManyOptions<Event> = {
      where,
      skip,
      take: limit,
      order: { date: 'DESC', title: 'ASC' },
      relations: relationsToLoad,
    };

    const [events, total] = await this.eventRepository.findAndCount(findOptions);

    const eventsCleaned = events.map(event => {
        if (event.createdBy) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, ...userWithoutPassword } = event.createdBy;
            event.createdBy = userWithoutPassword as User;
        }
        // If setlistEntries are loaded and songs have createdBy, clean them too if necessary.
        if (event.setlistEntries) {
            event.setlistEntries.forEach(entry => {
                if (entry.song && entry.song.createdBy) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { password_hash, ...songCreatorWithoutPassword } = entry.song.createdBy;
                    entry.song.createdBy = songCreatorWithoutPassword as User;
                }
            });
            // Sort setlist entries by orderInSetlist
            event.setlistEntries.sort((a, b) => a.orderInSetlist - b.orderInSetlist);
        }
        return event;
    });


    return {
      data: eventsCleaned,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getEventById(id: string, includeSetlist: boolean = false): Promise<Event | null> {
    const relationsToLoad = ['createdBy'];
    if (includeSetlist) {
      relationsToLoad.push('setlistEntries', 'setlistEntries.song');
    }

    const event = await this.eventRepository.findOne({
        where: { id },
        relations: relationsToLoad,
        // If including setlist, ensure it's ordered
        ...(includeSetlist && {
            join: {
                alias: "event",
                leftJoinAndSelect: {
                    setlistEntries: "event.setlistEntries",
                    song: "setlistEntries.song"
                }
            },
            // order: { // This ordering at top level might not work as expected for nested relations with findOne
            //     "setlistEntries.orderInSetlist": "ASC" // TypeORM might require specific syntax here or post-query sort
            // }
        })
    });

    if (!event) {
      throw new HttpException(404, 'Evento no encontrado.');
    }

    if (event.createdBy) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...userWithoutPassword } = event.createdBy;
        event.createdBy = userWithoutPassword as User;
    }

    if (includeSetlist && event.setlistEntries) {
        event.setlistEntries.forEach(entry => {
            if (entry.song && entry.song.createdBy) {
                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password_hash, ...songCreatorWithoutPassword } = entry.song.createdBy;
                entry.song.createdBy = songCreatorWithoutPassword as User;
            }
        });
        // Sort setlist entries after fetching
        event.setlistEntries.sort((a, b) => a.orderInSetlist - b.orderInSetlist);
    }


    return event;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventToUpdate = await queryRunner.manager.findOne(Event, {
        where: { id },
        relations: ['setlistEntries', 'setlistEntries.song'] // Load existing setlist
      });

      if (!eventToUpdate) {
        throw new HttpException(404, 'Evento no encontrado para actualizar.');
      }

      // Update basic event properties
      const { setlistEntries: setlistEntriesDto, ...basicEventData } = updateEventDto;
      queryRunner.manager.merge(Event, eventToUpdate, basicEventData); // Merge basic data
      if (updateEventDto.date) { // Handle date string conversion
        eventToUpdate.date = new Date(updateEventDto.date);
      }

      // Handle setlist updates
      if (setlistEntriesDto) {
        // Simple approach: Remove old entries and add new ones.
        // More complex: diff and update/add/delete selectively.

        // Remove existing setlist entries for this event
        if (eventToUpdate.setlistEntries && eventToUpdate.setlistEntries.length > 0) {
          await queryRunner.manager.remove(eventToUpdate.setlistEntries);
        }

        // Create and add new setlist entries
        const newSetlistEntryEntities: SetlistEntry[] = [];
        for (const entryDto of setlistEntriesDto) {
          const song = await this.songRepository.findOneBy({ id: entryDto.songId }); // Use main repo, not queryRunner.manager here for safety if song table is not part of transaction scope in some configs.
          if (!song) {
            throw new HttpException(400, `Canción con ID ${entryDto.songId} no encontrada para el setlist.`);
          }
          const newSetlistEntry = this.setlistEntryRepository.create({ // Use main repo for create
            event: eventToUpdate, // Link to the event
            eventId: eventToUpdate.id,
            song: song,
            songId: song.id,
            orderInSetlist: entryDto.orderInSetlist,
            notes: entryDto.notes,
          });
          newSetlistEntryEntities.push(newSetlistEntry);
        }
        if (newSetlistEntryEntities.length > 0) {
          await queryRunner.manager.save(newSetlistEntryEntities);
        }
        eventToUpdate.setlistEntries = newSetlistEntryEntities; // Update the relation on the event object
      }

      const savedEvent = await queryRunner.manager.save(Event, eventToUpdate); // Save the event with updated basic info and potentially new setlist relation context
      await queryRunner.commitTransaction();

      // Re-fetch the event with all relations to ensure consistency
      return this.getEventById(savedEvent.id, true);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      console.error("Error updating event:", error);
      throw new HttpException(500, 'Error al actualizar el evento.');
    } finally {
      await queryRunner.release();
    }
  }


  async deleteEvent(id: string): Promise<void> {
    // Deleting an event should also delete its setlist entries due to onDelete: 'CASCADE' in SetlistEntry entity
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new HttpException(404, 'Evento no encontrado para eliminar.');
    }
    const result = await this.eventRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(404, 'Evento no encontrado, no se pudo eliminar.');
    }
  }

  // --- Setlist specific methods ---

  async addSongToSetlist(eventId: string, createSetlistEntryDto: StandaloneCreateSetlistEntryDto): Promise<SetlistEntry> {
    const event = await this.eventRepository.findOneBy({id: eventId});
    if (!event) {
        throw new HttpException(404, `Evento con ID ${eventId} no encontrado.`);
    }
    const song = await this.songRepository.findOneBy({id: createSetlistEntryDto.songId});
    if (!song) {
        throw new HttpException(404, `Canción con ID ${createSetlistEntryDto.songId} no encontrada.`);
    }

    // Check if song already in setlist for this event to prevent duplicates (if desired)
    const existingEntry = await this.setlistEntryRepository.findOneBy({ eventId: eventId, songId: song.id });
    if (existingEntry) {
        throw new HttpException(409, `La canción '${song.title}' ya está en el setlist para este evento.`);
    }

    // Ensure orderInSetlist is unique for this event
    const maxOrderEntry = await this.setlistEntryRepository.findOne({
        where: { eventId: eventId },
        order: { orderInSetlist: 'DESC' }
    });
    const orderInSetlist = createSetlistEntryDto.orderInSetlist || ((maxOrderEntry?.orderInSetlist || 0) + 1);

    const existingOrderByOrder = await this.setlistEntryRepository.findOneBy({ eventId: eventId, orderInSetlist: orderInSetlist });
    if (existingOrderByOrder && createSetlistEntryDto.orderInSetlist) { // Only error if order was specified and conflicts
        throw new HttpException(409, `Ya existe una canción con el orden ${orderInSetlist} en el setlist para este evento. Reajuste el orden.`);
    }


    const newSetlistEntry = this.setlistEntryRepository.create({
        event: event,
        eventId: event.id,
        song: song,
        songId: song.id,
        orderInSetlist: orderInSetlist,
        notes: createSetlistEntryDto.notes,
    });

    return this.setlistEntryRepository.save(newSetlistEntry);
  }

  async removeSongFromSetlist(eventId: string, songId: string): Promise<void> {
    // Or use setlistEntryId if that's how it's identified
    const entry = await this.setlistEntryRepository.findOneBy({ eventId: eventId, songId: songId });
    if (!entry) {
        throw new HttpException(404, 'Canción no encontrada en el setlist de este evento.');
    }
    await this.setlistEntryRepository.remove(entry);
    // Optionally, re-order remaining setlist entries if order needs to be contiguous
  }

  async updateSetlistEntryOrder(eventId: string, songId: string, newOrder: number, notes?: string): Promise<SetlistEntry> {
    // Or use setlistEntryId
    const entry = await this.setlistEntryRepository.findOneBy({ eventId: eventId, songId: songId });
    if (!entry) {
        throw new HttpException(404, 'Canción no encontrada en el setlist de este evento para actualizar.');
    }

    // Check for conflict with newOrder if necessary and handle (e.g., shift other items)
    // This can be complex. A simpler approach is to allow direct update and let client manage order integrity or provide a batch update.
    const conflictingEntry = await this.setlistEntryRepository.findOne({
        where: { eventId: eventId, orderInSetlist: newOrder, id: Not(entry.id) }
    });
    if (conflictingEntry) {
        throw new HttpException(409, `El orden ${newOrder} ya está ocupado por otra canción en este setlist.`);
    }

    entry.orderInSetlist = newOrder;
    if (notes !== undefined) {
        entry.notes = notes;
    }
    return this.setlistEntryRepository.save(entry);
  }

  async getEventSetlist(eventId: string): Promise<SetlistEntry[]> {
    const event = await this.eventRepository.findOneBy({id: eventId});
    if (!event) {
        throw new HttpException(404, `Evento con ID ${eventId} no encontrado.`);
    }
    const setlist = await this.setlistEntryRepository.find({
        where: { eventId: eventId },
        relations: ['song', 'song.createdBy'], // Include song details, and song creator
        order: { orderInSetlist: 'ASC' }
    });

    // Clean sensitive data from related entities
    return setlist.map(entry => {
        if (entry.song && entry.song.createdBy) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash, ...userWithoutPassword } = entry.song.createdBy;
            entry.song.createdBy = userWithoutPassword as User;
        }
        return entry;
    });
  }
}

// Need to import MoreThanOrEqual and LessThanOrEqual from 'typeorm' for date queries
// import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
// Add them to the EventService file's imports.
