import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthResponse } from '../services/auth.service';
import { CreateUserDto } from '../dtos/user'; // For registration
import { LoginDto } from '../dtos/auth';   // Barrel import for auth DTOs
import { validate } from 'class-validator';
import { HttpException } from '../middlewares/errorHandler';
import { plainToClass } from 'class-transformer';
import { User } from '../entities/User'; // For typing req.user

// Extend Express Request type to include user from auth middleware
export interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'password_hash'> & { id: string; role: UserRole }; // Payload from JWT
}


export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createUserDto = plainToClass(CreateUserDto, req.body);
      const errors = await validate(createUserDto);

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al registrar usuario.', errors);
      }

      // Ensure password confirmation if implemented
      // if (createUserDto.password !== req.body.passwordConfirmation) {
      //   throw new HttpException(400, 'Las contraseñas no coinciden.');
      // }

      const user = await this.authService.register(createUserDto);
      res.status(201).json({ data: user, message: 'Usuario registrado exitosamente. Por favor, inicie sesión.' });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginDto = plainToClass(LoginDto, req.body);
      const errors = await validate(loginDto);

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al iniciar sesión.', errors);
      }

      const authResponse: AuthResponse = await this.authService.login(loginDto);

      // Optionally set token in an HttpOnly cookie for web clients
      // res.cookie('token', authResponse.token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      //   sameSite: 'strict', // Or 'lax'
      //   maxAge: 24 * 60 * 60 * 1000 // 1 day, should match token expiry
      // });

      res.status(200).json({ data: authResponse, message: 'Inicio de sesión exitoso.' });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    // This route should be protected by authMiddleware
    try {
      const user = req.user; // User payload from JWT, set by authMiddleware
      if (!user || !user.id) {
        throw new HttpException(401, 'No autenticado o ID de usuario no encontrado en el token.');
      }
      // Optionally re-fetch user from DB to get fresh data, but token data is usually sufficient
      // const freshUser = await this.authService.validateUserById(user.id);
      // if (!freshUser) {
      //   throw new HttpException(404, 'Usuario del token ya no existe.');
      // }
      // const { password_hash, ...userWithoutPassword } = freshUser;
      res.status(200).json({ data: user, message: 'Datos del usuario autenticado obtenidos exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  // Optional: Logout route
  // public logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     // For cookie-based auth, clear the cookie
  //     // res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  //     // For token-based auth, logout is typically handled client-side by deleting the token.
  //     // If you have a token blacklist on the server, you'd add the token to it here.
  //     res.status(200).json({ message: 'Cierre de sesión exitoso.' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

// Need UserRole for AuthenticatedRequest
import { UserRole } from '../entities/User';
