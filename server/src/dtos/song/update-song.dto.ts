import { IsString, Length, IsOptional, IsInt, Min, IsUrl, IsUUID } from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto.' })
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'El artista original debe ser un texto.' })
  @Length(1, 255, { message: 'El artista original debe tener entre 1 y 255 caracteres.' })
  original_artist?: string;

  @IsOptional()
  @IsInt({ message: 'La duración debe ser un número entero (segundos).' })
  @Min(0, { message: 'La duración no puede ser negativa.' })
  duration_seconds?: number;

  @IsOptional()
  @IsString({ message: 'La letra debe ser un texto.' })
  lyrics?: string;

  @IsOptional()
  @IsString({ message: 'La tonalidad debe ser un texto.' })
  @Length(1, 50, { message: 'La tonalidad debe tener entre 1 y 50 caracteres.' })
  key?: string;

  @IsOptional()
  @IsString({ message: 'El género debe ser un texto.' })
  @Length(1, 100, { message: 'El género debe tener entre 1 y 100 caracteres.' })
  genre?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL del audio no es válida.' })
  audio_url?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL de la partitura no es válida.' })
  sheet_music_url?: string;

  // created_by_user_id is typically not updatable or handled by the system
}
