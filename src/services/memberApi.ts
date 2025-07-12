import apiClient from './apiClient';
import { PaginatedMembersResponse, Member } from '../types/member';

// Define the query parameters for fetching members
export interface GetMembersQuery {
  page?: number;
  limit?: number;
  name?: string;
  roleInBand?: string;
  instrument?: string;
  isActiveMember?: boolean;
}

// Define a standard API response structure for a single item
interface ApiResponse<T> {
    data: T;
    message: string;
}

/**
 * Fetches a paginated list of members from the API.
 * @param params - The query parameters for pagination and filtering.
 * @returns A promise that resolves to the paginated member data.
 */
export const getMembers = async (params: GetMembersQuery = {}): Promise<PaginatedMembersResponse> => {
  try {
    const response = await apiClient.get<PaginatedMembersResponse>('/members', { params });
    return response.data;
  } catch (error: any) {
    console.error('Get Members API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('An unknown error occurred while fetching members.');
  }
};

/**
 * Fetches a single member by their ID.
 * @param id - The ID of the member to fetch.
 * @returns A promise that resolves to the member data.
 */
export const getMemberById = async (id: string): Promise<ApiResponse<Member>> => {
    try {
        const response = await apiClient.get<ApiResponse<Member>>(`/members/${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Get Member by ID (${id}) API error:`, error.response?.data || error.message);
        throw error.response?.data || new Error('An unknown error occurred while fetching the member.');
    }
}

// Note: We will add create, update, and delete functions here later when building the admin features.
// export const createMember = async (memberData: CreateMemberDto) => { ... };
// export const updateMember = async (id: string, memberData: UpdateMemberDto) => { ... };
// export const deleteMember = async (id: string) => { ... };
