"use client";
import { useCallback } from "react";
import { useDaysRemainingData } from "./use-days-remaining";
import { useSurplusData } from "./use-surplus-analytics";

export const useDashboardData = () => {
  const surplusData = useSurplusData();
  const daysRemainingData = useDaysRemainingData();

  const loading = surplusData.loading || daysRemainingData.loading;

  const error = surplusData.error || daysRemainingData.error;

  const refetchAll = useCallback(() => {
    surplusData.refetch();
    daysRemainingData.refetch();
  }, [surplusData.refetch, daysRemainingData.refetch]);

  return {
    surplusData: surplusData.data,
    metadata: surplusData.metadata,

    daysRemainingByCategory: daysRemainingData.daysRemainingByCategory,
    daysRemainingByProduct: daysRemainingData.daysRemainingByProduct,
    daysRemainingSummary: daysRemainingData.daysRemainingSummary,

    loading,
    error,

    refetchAll,
    refetchSurplus: surplusData.refetch,
    refetchDaysRemaining: daysRemainingData.refetch,
  };
};
