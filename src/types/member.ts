// Matches the Member entity from the backend
export interface Member {
  id: string;
  name: string;
  roleInBand: string;
  bio?: string;
  photoUrl?: string;
  instrument?: string;
  isActiveMember: boolean;
  createdAt: string;
  updatedAt: string;
}

// For paginated responses from the backend's MemberService
export interface PaginatedMembersResponse {
  data: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message: string;
}
