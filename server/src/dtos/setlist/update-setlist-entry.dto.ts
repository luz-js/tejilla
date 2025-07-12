import { IsInt, Min, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateSetlistEntryDto {
  // eventId and songId are typically not changed for an existing setlist entry.
  // If they need to change, it's often conceptually a new entry.
  // However, allowing order or notes to change is common.

  @IsOptional() // To make all fields optional for partial updates
  @IsUUID('4', { message: 'El ID del evento debe ser un UUID válido.' })
  eventId?: string; // Usually not updated, but can be included for context or specific use cases

  @IsOptional()
  @IsUUID('4', { message: 'El ID de la canción debe ser un UUID válido.' })
  songId?: string; // Usually not updated

  @IsOptional()
  @IsInt({ message: 'El orden en el setlist debe ser un número entero.' })
  @Min(1, { message: 'El orden en el setlist debe ser al menos 1.' })
  orderInSetlist?: number;

  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto.'})
  notes?: string;
}
