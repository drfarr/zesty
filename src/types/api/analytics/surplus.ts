export interface SurplusData {
  categoryId: string;
  categoryName: string;
  totalWeight: number;
  itemCount: number;
}

export interface SurplusApiResponse {
  success: boolean;
  data: SurplusData[];
  metadata: {
    totalCategories: number;
    totalWeight: number;
    totalItems: number;
  };
}
