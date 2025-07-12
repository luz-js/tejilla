import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from './errorHandler';
import { UserRole, User } from '../entities/User'; // Assuming UserRole is exported from User entity
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

// Define the structure of the JWT payload
export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

// Extend Express Request type to include user from JWT payload
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // User payload from JWT
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-for-development';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(401, 'No autorizado. Token no proporcionado o formato incorrecto.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException(401, 'No autorizado. Token no encontrado después de Bearer.');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Attach user payload to the request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpException(401, 'No autorizado. Token ha expirado.'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'No autorizado. Token inválido.'));
    }
    // Pass other errors to the global error handler
    return next(error instanceof HttpException ? error : new HttpException(401, 'No autorizado. Error de token.'));
  }
};

// Optional: Higher-order function for role-based authorization (can be in a separate role.middleware.ts)
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new HttpException(401, 'No autorizado. Payload de usuario no encontrado.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpException(403, `Acceso denegado. Rol '${req.user.role}' no tiene permiso para este recurso.`));
    }
    next();
  };
};
