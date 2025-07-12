export * from './user';
export * from './song';
export * from './member';
export * from './event';
export * from './setlist';

// General purpose DTOs can also be defined here if needed
// For example, for pagination:
// export class PaginatedResponseDto<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
// }

// export class PaginationQueryDto {
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   page?: number = 1;

//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @Max(100) // Example max limit
//   limit?: number = 10;
// }
