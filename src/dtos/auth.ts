// Matches the shape of the backend's LoginDto
export interface LoginDto {
  email: string;
  password?: string; // Password is required for login but might be optional in other contexts
}

// We can add other auth-related DTO shapes here if needed, e.g., for password reset.
