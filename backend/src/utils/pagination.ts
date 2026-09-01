export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getPagination = (pageStr?: any, limitStr?: any): PaginationParams => {
  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(limitStr, 10) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const paginateData = <T>(data: T[], total: number, params: PaginationParams): PaginatedResult<T> => {
  return {
    data,
    pagination: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit) || 1
    }
  };
};
