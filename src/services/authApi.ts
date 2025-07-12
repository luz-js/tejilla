import apiClient from './apiClient';
import { AuthResponse } from '../types/auth';
import { LoginDto } from '../dtos/auth';
import { CreateUserDto } from '../dtos/user';

// Define a standard API response structure for data calls
interface ApiResponse<T> {
  data: T;
  message: string;
}

/**
 * Logs in a user.
 * @param loginDto - The login credentials.
 * @returns The authentication response from the API.
 */
export const loginUser = async (loginDto: LoginDto): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', loginDto);
    return response.data;
  } catch (error: any) {
    // Re-throw the error to be handled by the calling component or a global handler
    // The axios interceptor in apiClient.ts can also handle global errors like 401s.
    console.error('Login API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('An unknown error occurred during login.');
  }
};

/**
 * Registers a new user.
 * @param createUserDto - The user registration details.
 * @returns The newly created user's data (without password).
 */
export const registerUser = async (createUserDto: CreateUserDto): Promise<ApiResponse<any>> => {
  try {
    // The backend's /auth/register returns { data: User, message: string }
    const response = await apiClient.post<ApiResponse<any>>('/auth/register', createUserDto);
    return response.data;
  } catch (error: any) {
    console.error('Registration API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('An unknown error occurred during registration.');
  }
};

/**
 * Fetches the currently authenticated user's profile.
 * Requires the auth token to be set in the apiClient interceptor.
 * @returns The authenticated user's data.
 */
export const getMyProfile = async (): Promise<ApiResponse<any>> => {
    try {
        const response = await apiClient.get<ApiResponse<any>>('/auth/me');
        return response.data;
    } catch (error: any) {
        console.error('Get Profile API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('An unknown error occurred while fetching profile.');
    }
}
