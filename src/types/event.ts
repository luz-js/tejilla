import { User } from './auth';
import { Song } from './song';

// Matches the SetlistEntry entity from the backend
export interface SetlistEntry {
  id: string;
  orderInSetlist: number;
  notes?: string;
  song: Song; // The full song object is nested
}

// Matches the Event entity from the backend
export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  venueName?: string;
  venueAddress?: string;
  description?: string;
  isPublic: boolean;
  createdBy?: User;
  setlistEntries?: SetlistEntry[];
  createdAt: string;
  updatedAt: string;
}

// For paginated responses from the backend's EventService
export interface PaginatedEventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
}
