import { useQuery } from "@tanstack/react-query";
import type {
  MetadataQuality,
  ContentCoverage,
  MaintenanceActivity,
  UsageEngagement,
  OperationalKPIs,
  AdvancedAnalytics,
} from "@/types/backendMetrics";

// Use relative URLs in development so Vite's dev-server proxy handles /api requests.
// In production (or when VITE_API_BASE_URL is set), use that value or fallback to the ngrok URL.
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL || "http://3.148.102.253:8000");

async function fetchMetric<T>(endpoint: string): Promise<T> {
  console.log(`Fetching from: ${API_BASE_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    console.log(`Response status for ${endpoint}:`, response.status);

    const respText = await response.text();
    if (!response.ok) {
      console.error(`Error response for ${endpoint}:`, respText);
      throw new Error(`Error fetching ${endpoint}: ${response.status} ${response.statusText} - ${respText}`);
    }

    // Try to parse JSON, but provide a clearer error if the body is not valid JSON
    try {
      const data = JSON.parse(respText) as T;
      console.log(`Data received from ${endpoint}:`, data);
      return data;
    } catch (parseError) {
      console.error(`Failed to parse JSON from ${endpoint}. Body:`, respText);
      throw new Error(`Invalid JSON response from ${endpoint}: ${String(parseError)} - ${respText.slice(0, 200)}`);
    }
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

export const useMetadataQuality = (type: string = "dataset") => {
  return useQuery<MetadataQuality>({
    queryKey: ["metadata-quality", type],
    queryFn: () => fetchMetric(`/api/v1/metrics/metadata-quality?type=${type}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContentCoverage = (type: string = "dataset") => {
  return useQuery<ContentCoverage>({
    queryKey: ["content-coverage", type],
    queryFn: () => fetchMetric(`/api/v1/metrics/content-coverage?type=${type}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMaintenanceActivity = (type: string = "dataset", obsoleteMonths: number = 12) => {
  return useQuery<MaintenanceActivity>({
    queryKey: ["maintenance-activity", type, obsoleteMonths],
    queryFn: () => fetchMetric(`/api/v1/metrics/maintenance-activity?type=${type}&obsolete_months=${obsoleteMonths}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUsageEngagement = (type: string = "dataset") => {
  return useQuery<UsageEngagement>({
    queryKey: ["usage-engagement", type],
    queryFn: () => fetchMetric(`/api/v1/metrics/usage-engagement?type=${type}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOperationalKPIs = (type: string = "dataset") => {
  return useQuery<OperationalKPIs>({
    queryKey: ["operational-kpis", type],
    queryFn: () => fetchMetric(`/api/v1/metrics/operational-kpis?type=${type}`),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdvancedAnalytics = (type: string = "dataset") => {
  return useQuery<AdvancedAnalytics>({
    queryKey: ["advanced-analytics", type],
    queryFn: () => fetchMetric(`/api/v1/metrics/advanced-analytics?type=${type}`),
    staleTime: 5 * 60 * 1000,
  });
};
