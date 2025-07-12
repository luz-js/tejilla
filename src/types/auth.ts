// Matches the UserRole enum in the backend
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  LECTOR = 'lector',
}

// Represents the user object received from the backend (without password hash)
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string; // Dates are typically strings in JSON
  updatedAt: string;
}

// Matches the AuthResponse structure from the backend's AuthService
export interface AuthResponse {
  token: string;
  user: User;
}
