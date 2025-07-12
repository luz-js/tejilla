import apiClient from './apiClient';
import { PaginatedSongsResponse, Song } from '../types/song';

// Define the query parameters for fetching songs
export interface GetSongsQuery {
  page?: number;
  limit?: number;
  title?: string;
  artist?: string;
  genre?: string;
  key?: string;
}

// Define a standard API response structure for a single item
interface ApiResponse<T> {
    data: T;
    message: string;
}

/**
 * Fetches a paginated list of songs from the API.
 * @param params - The query parameters for pagination and filtering.
 * @returns A promise that resolves to the paginated song data.
 */
export const getSongs = async (params: GetSongsQuery = {}): Promise<PaginatedSongsResponse> => {
  try {
    const response = await apiClient.get<PaginatedSongsResponse>('/songs', { params });
    return response.data;
  } catch (error: any) {
    console.error('Get Songs API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('An unknown error occurred while fetching songs.');
  }
};

/**
 * Fetches a single song by its ID.
 * @param id - The ID of the song to fetch.
 * @returns A promise that resolves to the song data.
 */
export const getSongById = async (id: string): Promise<ApiResponse<Song>> => {
    try {
        const response = await apiClient.get<ApiResponse<Song>>(`/songs/${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Get Song by ID (${id}) API error:`, error.response?.data || error.message);
        throw error.response?.data || new Error('An unknown error occurred while fetching the song.');
    }
}

// Note: We will add create, update, and delete functions here later when building the admin features.
// export const createSong = async (songData: CreateSongDto) => { ... };
// export const updateSong = async (id: string, songData: UpdateSongDto) => { ... };
// export const deleteSong = async (id: string) => { ... };
