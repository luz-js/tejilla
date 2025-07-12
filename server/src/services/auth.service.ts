import { UserService } from './user.service';
import { User } from '../entities/User';
import { CreateUserDto } from '../dtos/user'; // For registration
import { LoginDto } from '../dtos/auth/login.dto'; // To be created
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpException } from '../middlewares/errorHandler';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' }); // Ensure .env is loaded

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash'>; // User details without password hash
}

export class AuthService {
  private userService: UserService;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;


  constructor() {
    this.userService = new UserService();
    this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
    if (this.JWT_SECRET === 'default-secret-key-for-development' && process.env.NODE_ENV !== 'test') {
        console.warn('WARNING: Using default JWT secret in non-test environment. Set JWT_SECRET in .env for production!');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    // Consider if role should be restricted during self-registration
    // For now, UserService handles default role.
    const user = await this.userService.createUser(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const user = await this.userService.getUserByEmail(email); // Ensure this method fetches password_hash
    if (!user) {
      throw new HttpException(401, 'Credenciales inválidas. Usuario no encontrado.');
    }

    // It's crucial that user.password_hash is available.
    // The default findOneBy in UserService might not select it if User entity has @Exclude on password_hash for class-transformer.
    // Or if the service method explicitly omits it. Let's assume it's fetched.
    // If not, fetch it specifically:
    const userWithPassword = await AppDataSource.getRepository(User).findOne({ where: { email }, select: ['id', 'username', 'email', 'role', 'password_hash', 'createdAt', 'updatedAt']});
    if (!userWithPassword || !userWithPassword.password_hash) {
        throw new HttpException(401, 'Credenciales inválidas o error al obtener datos del usuario.');
    }


    const isPasswordValid = await bcrypt.compare(password, userWithPassword.password_hash);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Credenciales inválidas. Contraseña incorrecta.');
    }

    const payload = {
      id: userWithPassword.id,
      username: userWithPassword.username,
      email: userWithPassword.email,
      role: userWithPassword.role,
    };

    const token = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userResponse } = userWithPassword;

    return { token, user: userResponse };
  }

  async validateUserById(userId: string): Promise<User | null> {
    // This is useful for Passport or other auth strategies that need to re-fetch user on each request
    return this.userService.getUserById(userId); // This should return user without password hash by default
  }
}

// Need to import AppDataSource for the specific password fetch
import { AppDataSource } from '../config/data-source';
