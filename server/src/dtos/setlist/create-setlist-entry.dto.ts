import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CreateSetlistEntryDto {
  @IsUUID('4', { message: 'El ID del evento debe ser un UUID válido.' })
  eventId: string;

  @IsUUID('4', { message: 'El ID de la canción debe ser un UUID válido.' })
  songId: string;

  @IsInt({ message: 'El orden en el setlist debe ser un número entero.' })
  @Min(1, { message: 'El orden en el setlist debe ser al menos 1.' })
  orderInSetlist: number;

  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto.'})
  notes?: string;
}
