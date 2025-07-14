import { API } from "@/lib/api";
import { DataPagination, SortOrder } from "@/types/api";
import {
  IngredientsQueryParams,
  IngredientWithCategoryAndOwner,
  IngredientSortField as SortField,
} from "@/types/api/ingredients";
import { useCallback, useEffect, useState } from "react";

export interface IngredientsFilters {
  search: string;
  categoryId: string;
  ownerId: string;
  expiringSoon: string;
}

export function useIngredients() {
  const [data, setData] = useState<IngredientWithCategoryAndOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<DataPagination>({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState<IngredientsFilters>({
    search: "",
    categoryId: "",
    ownerId: "",
    expiringSoon: "",
  });

  const [sorting, setSorting] = useState<{
    sortBy: SortField;
    sortOrder: SortOrder;
  }>({
    sortBy: "bbeDate",
    sortOrder: "asc",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching ingredients with params");

      const params: IngredientsQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        // sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.ownerId && { ownerId: filters.ownerId }),
        ...(filters.expiringSoon && { expiringSoon: parseInt(filters.expiringSoon) }),
      };

      const { data, pagination: _pagination } = await API.getIngredients(params);
      const { total, pages, hasNext, hasPrev } = _pagination;

      setData(data);
      setPagination((prev: DataPagination) => ({
        ...prev,
        total,
        pages,
        hasNext,
        hasPrev,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch ingredients");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sorting, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updatePagination = (updates: Partial<DataPagination>) => {
    setPagination((prev: DataPagination) => ({ ...prev, ...updates }));
  };

  const updateFilters = (updates: Partial<IngredientsFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    // Reset to first page when filters change
    setPagination((prev: DataPagination) => ({ ...prev, page: 1 }));
  };

  const updateSorting = (sortBy: SortField) => {
    setSorting((prev) => ({
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
    // Reset to first page when sorting changes
    setPagination((prev: DataPagination) => ({ ...prev, page: 1 }));
  };

  return {
    data,
    loading,
    error,
    pagination,
    filters,
    sorting,
    updatePagination,
    updateFilters,
    updateSorting,
    refetch: fetchData,
  };
}
