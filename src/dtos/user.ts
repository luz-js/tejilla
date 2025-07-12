import { UserRole } from '../types/auth'; // Import the enum

// Matches the shape of the backend's CreateUserDto
export interface CreateUserDto {
  username: string;
  email: string;
  password?: string;
  role?: UserRole;
  // passwordConfirmation?: string; // Optional if you add this field to your form
}

// Matches the shape of the backend's UpdateUserDto
export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}
