import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createSubmissionsApi } from "../api/submissions";
import { useAxiosWithAuth } from "../lib/axios";

export const useSubmissions = () => {
  const axiosInstance = useAxiosWithAuth();
  const api = createSubmissionsApi(axiosInstance);

  return useQuery({
    queryKey: ["mySubmissions"],
    queryFn: api.getMySubmissions,
  });
};

export const useCreateSubmission = () => {
  const axiosInstance = useAxiosWithAuth();
  const api = createSubmissionsApi(axiosInstance);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["myAnalytics"] });
    },
    onError: (err) => {
      console.error("Submission creation error:", err);
    },
  });
};
