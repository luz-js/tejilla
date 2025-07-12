import { IsString, Length, IsOptional, IsDateString, IsBoolean, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// This DTO is for updating an existing setlist entry.
import { IsInt, Min } from 'class-validator'; // Ensure IsInt and Min are imported

// It might need an ID to identify which entry to update.
export class UpdateEventSetlistEntryDto {
  @IsOptional() // If you allow adding new songs during event update, this might not be optional
  @IsUUID('4', { message: 'El ID de la entrada del setlist (setlist entry id) debe ser un UUID válido.'})
  id?: string; // ID of the SetlistEntry to update, or undefined for new entries

  @IsUUID('4', { message: 'El ID de la canción (songId) debe ser un UUID válido.'})
  songId: string; // songId is mandatory to link to a song

  @IsOptional()
  @IsInt({ message: 'El orden en el setlist debe ser un número entero.'})
  @Min(1, { message: 'El orden en el setlist debe ser al menos 1.'})
  orderInSetlist?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}


export class UpdateEventDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto.' })
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres.' })
  title?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha del evento no es válida. Use el formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).' })
  date?: string;

  @IsOptional()
  @IsString({ message: 'El nombre del lugar debe ser un texto.' })
  @Length(1, 255)
  venueName?: string;

  @IsOptional()
  @IsString({ message: 'La dirección del lugar debe ser un texto.' })
  venueAddress?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto.' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de publicidad debe ser un valor booleano (true/false).' })
  isPublic?: boolean;

  // created_by_user_id is typically not updatable or handled by the system

  // For updating setlists:
  // You might want a more sophisticated way to handle setlist updates, e.g.,
  // - A list of entries to add
  // - A list of entry IDs to remove
  // - A list of entries to update (like UpdateEventSetlistEntryDto)
  // For simplicity here, we'll allow replacing the entire setlist or providing updates.
  // This structure assumes you might be sending the whole new setlist or just parts to update.
  // A more robust approach would be dedicated endpoints for setlist management (e.g., POST /events/:id/setlist, DELETE /events/:id/setlist/:entryId)
  @IsOptional()
  @IsArray({ message: 'Las entradas del setlist deben ser un arreglo.'})
  @ValidateNested({ each: true })
  @Type(() => UpdateEventSetlistEntryDto) // Use if you have a specific DTO for updating setlist entries
  setlistEntries?: UpdateEventSetlistEntryDto[];
}
