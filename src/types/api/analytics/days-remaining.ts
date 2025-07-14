export interface DaysRemainingData {
  categoryId?: string;
  categoryName?: string;
  productName?: string;
  categories?: string[];
  totalItems: number;
  totalWeight: number;
  averageDaysRemaining: number;
  statusCounts: {
    expired: number;
    critical: number;
    warning: number;
    good: number;
    longTerm: number;
  };
}

export interface DaysRemainingResponse {
  success: boolean;
  type: "category" | "product";
  data: DaysRemainingData[];
  summary: {
    totalItems: number;
    totalWeight: number;
    overallStatusCounts: {
      expired: number;
      critical: number;
      warning: number;
      good: number;
      longTerm: number;
    };
    averageDaysRemaining: number;
  };
}
