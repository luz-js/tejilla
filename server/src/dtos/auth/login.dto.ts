import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @IsString({ message: 'La contraseña no puede estar vacía.'})
  @Length(8, 255, { message: 'La contraseña debe tener al menos 8 caracteres.' }) // Matching typical password length requirements
  password: string;
}
