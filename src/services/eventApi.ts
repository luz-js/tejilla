import apiClient from './apiClient';
import { PaginatedEventsResponse, Event } from '../types/event';

// Define the query parameters for fetching events
export interface GetEventsQuery {
  page?: number;
  limit?: number;
  title?: string;
  venueName?: string;
  dateFrom?: string;
  dateTo?: string;
  isPublic?: boolean;
  includeSetlist?: boolean;
}

// Define a standard API response structure for a single item
interface ApiResponse<T> {
    data: T;
    message: string;
}

/**
 * Fetches a paginated list of events from the API.
 * @param params - The query parameters for pagination and filtering.
 * @returns A promise that resolves to the paginated event data.
 */
export const getEvents = async (params: GetEventsQuery = {}): Promise<PaginatedEventsResponse> => {
  try {
    const response = await apiClient.get<PaginatedEventsResponse>('/events', { params });
    return response.data;
  } catch (error: any) {
    console.error('Get Events API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('An unknown error occurred while fetching events.');
  }
};

/**
 * Fetches a single event by its ID.
 * @param id - The ID of the event to fetch.
 * @param includeSetlist - Whether to include the setlist in the response.
 * @returns A promise that resolves to the event data.
 */
export const getEventById = async (id: string, includeSetlist: boolean = false): Promise<ApiResponse<Event>> => {
    try {
        const params = { includeSetlist };
        const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`, { params });
        return response.data;
    } catch (error: any) {
        console.error(`Get Event by ID (${id}) API error:`, error.response?.data || error.message);
        throw error.response?.data || new Error('An unknown error occurred while fetching the event.');
    }
}

// Note: We will add create, update, and delete functions here later when building the admin features.
// export const createEvent = async (eventData: CreateEventDto) => { ... };
// export const updateEvent = async (id: string, eventData: UpdateEventDto) => { ... };
// export const deleteEvent = async (id: string) => { ... };
