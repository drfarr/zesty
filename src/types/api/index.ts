export type DataPagination = {
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
  page: number;
  pages: number;
  total: number;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: DataPagination;
}

export type SortOrder = "asc" | "desc";
