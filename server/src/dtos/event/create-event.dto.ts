import { IsString, Length, IsOptional, IsDateString, IsBoolean, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer'; // Required for ValidateNested with arrays

// Forward declaration or direct import for SetlistEntryDto if it's simple enough
// For now, we'll assume setlist entries are managed separately or with simpler structure here.
// If CreateSetlistEntryDto is complex, it should be in its own file.
import { IsInt, Min } from 'class-validator'; // Ensure IsInt and Min are imported

class CreateEventSetlistEntryDto {
  @IsUUID('4', { message: 'El ID de la canción debe ser un UUID válido.' })
  songId: string;

  @IsInt({ message: 'El orden en el setlist debe ser un número entero.' })
  @Min(1, { message: 'El orden en el setlist debe ser al menos 1.' })
  orderInSetlist: number;

  @IsOptional()
  @IsString()
  notes?: string;
}


export class CreateEventDto {
  @IsString({ message: 'El título debe ser un texto.' })
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres.' })
  title: string;

  @IsDateString({}, { message: 'La fecha del evento no es válida. Use el formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).' })
  date: string; // Using string for ISO 8601 date, will be converted to Date object in service

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

  @IsOptional()
  @IsUUID('4', {message: 'El ID de usuario creador debe ser un UUID válido.'})
  created_by_user_id?: string;

  // Optional: Allow creating setlist entries directly with the event
  @IsOptional()
  @IsArray({ message: 'Las entradas del setlist deben ser un arreglo.'})
  @ValidateNested({ each: true })
  @Type(() => CreateEventSetlistEntryDto)
  setlistEntries?: CreateEventSetlistEntryDto[];
}
