import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user';
import { validate } from 'class-validator';
import { HttpException } from '../middlewares/errorHandler';
import { plainToClass } from 'class-transformer'; // To transform plain objects to DTO instances for validation

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Bound methods to ensure 'this' context is correct when used as route handlers
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createUserDto = plainToClass(CreateUserDto, req.body);
      const errors = await validate(createUserDto);

      if (errors.length > 0) {
        // Concatenate all error messages (or use a more structured error response)
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación.', errors);
      }

      const user = await this.userService.createUser(createUserDto);
      // Omit password hash before sending response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user;
      res.status(201).json({ data: userWithoutPassword, message: 'Usuario creado exitosamente.' });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  };

  public getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ data: users, message: 'Usuarios obtenidos exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) { // Basic check, though routing should ensure ID is present
        throw new HttpException(400, 'ID de usuario no proporcionado.');
      }
      const user = await this.userService.getUserById(userId);
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...userWithoutPassword } = user;
        res.status(200).json({ data: userWithoutPassword, message: 'Usuario obtenido exitosamente.' });
      } else {
        // This case should be handled by service throwing 404, but as a fallback:
        throw new HttpException(404, 'Usuario no encontrado.');
      }
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new HttpException(400, 'ID de usuario no proporcionado.');
      }

      const updateUserDto = plainToClass(UpdateUserDto, req.body);
      const errors = await validate(updateUserDto); // Add { skipMissingProperties: true } if you allow partial updates without all fields present

      if (errors.length > 0) {
        const message = errors.map(error => Object.values(error.constraints || {})).join(', ');
        throw new HttpException(400, message || 'Error de validación al actualizar.', errors);
      }

      // Ensure body is not empty for update if DTO allows all optional
      if (Object.keys(updateUserDto).length === 0) {
        throw new HttpException(400, 'El cuerpo de la solicitud no puede estar vacío para la actualización.');
      }

      const updatedUser = await this.userService.updateUser(userId, updateUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = updatedUser;
      res.status(200).json({ data: userWithoutPassword, message: 'Usuario actualizado exitosamente.' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new HttpException(400, 'ID de usuario no proporcionado.');
      }
      await this.userService.deleteUser(userId);
      res.status(200).json({ message: 'Usuario eliminado exitosamente.' }); // Or 204 No Content
    } catch (error) {
      next(error);
    }
  };
}
