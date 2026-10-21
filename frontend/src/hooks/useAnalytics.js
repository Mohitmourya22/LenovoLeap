import { useQuery } from "@tanstack/react-query";
import { createAnalyticsApi } from "../api/analytics";
import { useAxiosWithAuth } from "../lib/axios";

export const useAnalytics = () => {
  const axiosInstance = useAxiosWithAuth();
  const api = createAnalyticsApi(axiosInstance);

  return useQuery({
    queryKey: ["myAnalytics"],
    queryFn: api.getMyAnalytics,
  });
};
