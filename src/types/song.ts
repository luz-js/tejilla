import { User } from './auth'; // Reuse the User type

// Matches the Song entity from the backend
export interface Song {
  id: string;
  title: string;
  original_artist?: string;
  duration_seconds?: number;
  lyrics?: string;
  key?: string;
  genre?: string;
  audio_url?: string;
  sheet_music_url?: string;
  createdBy?: User; // The creator object
  created_by_user_id?: string; // The ID of the creator
  createdAt: string;
  updatedAt: string;
}

// For paginated responses from the backend's SongService
export interface PaginatedSongsResponse {
  data: Song[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
}
