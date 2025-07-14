import { SurplusApiResponse, SurplusData } from "@/types/api/analytics/surplus";
import { useCallback, useEffect, useState } from "react";

// Custom hook for surplus data
export const useSurplusData = () => {
  const [data, setData] = useState<SurplusData[]>([]);
  const [metadata, setMetadata] = useState<SurplusApiResponse["metadata"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurplusData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/analytics/ingredients/surplus");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SurplusApiResponse = await response.json();

      if (result.success) {
        setData(result.data);
        setMetadata(result.metadata);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching surplus data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurplusData();
  }, [fetchSurplusData]);

  return {
    data,
    metadata,
    loading,
    error,
    refetch: fetchSurplusData,
  };
};
