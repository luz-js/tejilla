import { Response, NextFunction } from 'express';
import { HttpException } from './errorHandler';
import { UserRole } from '../entities/User'; // Assuming UserRole is exported from User entity
import { AuthenticatedRequest } from './auth.middleware'; // Import AuthenticatedRequest type

// Higher-order function for role-based authorization
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      // This should ideally be caught by authMiddleware first if user is not authenticated
      return next(new HttpException(401, 'No autenticado. No se puede verificar el rol.'));
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return next(
        new HttpException(
          403,
          `Acceso denegado. El rol '${userRole}' no tiene permiso para acceder a este recurso. Roles permitidos: ${allowedRoles.join(', ')}.`,
        ),
      );
    }
    next(); // User has one of the allowed roles
  };
};

// Example of a more specific role check if needed (can be extended)
export const isAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  if (!req.user || !req.user.role) {
    return next(new HttpException(401, 'No autenticado.'));
  }
  if (req.user.role !== UserRole.ADMIN) {
    return next(new HttpException(403, 'Acceso denegado. Se requiere rol de Administrador.'));
  }
  next();
};

export const isEditorOrAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  if (!req.user || !req.user.role) {
    return next(new HttpException(401, 'No autenticado.'));
  }
  if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.EDITOR) {
    return next(new HttpException(403, 'Acceso denegado. Se requiere rol de Editor o Administrador.'));
  }
  next();
};

// You can also export UserRole from here if it makes sense for your imports
// export { UserRole } from '../entities/User';
