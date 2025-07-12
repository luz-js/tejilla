import { IsString, Length, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto.' })
  @Length(1, 150, { message: 'El nombre debe tener entre 1 y 150 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'El rol en la banda debe ser un texto.' })
  @Length(1, 100, { message: 'El rol en la banda debe tener entre 1 y 100 caracteres.' })
  roleInBand?: string;

  @IsOptional()
  @IsString({ message: 'La biografía debe ser un texto.' })
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL de la foto no es válida.' })
  photoUrl?: string;

  @IsOptional()
  @IsString({ message: 'El instrumento debe ser un texto.' })
  @Length(1, 100, { message: 'El instrumento debe tener entre 1 y 100 caracteres.' })
  instrument?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de actividad debe ser un valor booleano (true/false).' })
  isActiveMember?: boolean;
}
