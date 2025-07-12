import { IsEmail, IsString, Length, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { UserRole } from '../../entities/User'; // Adjust path as necessary

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50, { message: 'El nombre de usuario debe tener entre 3 y 50 caracteres.' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(8, 255, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password?: string; // For password changes, plain password, will be hashed

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol proporcionado no es válido.' })
  role?: UserRole;

  // Optional fields from User entity
  // @IsOptional()
  // @IsString()
  // @Length(1, 100)
  // firstName?: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 100)
  // lastName?: string;
}
