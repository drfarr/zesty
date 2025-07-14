"use client";
import { DaysRemainingData, DaysRemainingResponse } from "@/types/api/analytics/days-remaining";
import { useCallback, useEffect, useState } from "react";

export const useDaysRemainingData = () => {
  const [daysRemainingByCategory, setDaysRemainingByCategory] = useState<DaysRemainingData[]>([]);
  const [daysRemainingByProduct, setDaysRemainingByProduct] = useState<DaysRemainingData[]>([]);
  const [daysRemainingSummary, setDaysRemainingSummary] = useState<
    DaysRemainingResponse["summary"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDaysRemainingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch by category and product in parallel
      const [categoryResponse, productResponse] = await Promise.all([
        fetch("/api/analytics/ingredients/days-remaining?groupBy=category"),
        fetch("/api/analytics/ingredients/days-remaining?groupBy=product"),
      ]);

      // Process category response
      if (categoryResponse.ok) {
        const categoryResult: DaysRemainingResponse = await categoryResponse.json();
        if (categoryResult.success) {
          setDaysRemainingByCategory(categoryResult.data);
          setDaysRemainingSummary(categoryResult.summary);
        }
      } else {
        throw new Error(`Category API error! status: ${categoryResponse.status}`);
      }

      // Process product response
      if (productResponse.ok) {
        const productResult: DaysRemainingResponse = await productResponse.json();
        if (productResult.success) {
          setDaysRemainingByProduct(productResult.data);
        }
      } else {
        console.warn(`Product API error! status: ${productResponse.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching days remaining data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDaysRemainingData();
  }, [fetchDaysRemainingData]);

  return {
    daysRemainingByCategory,
    daysRemainingByProduct,
    daysRemainingSummary,
    loading,
    error,
    refetch: fetchDaysRemainingData,
  };
};
