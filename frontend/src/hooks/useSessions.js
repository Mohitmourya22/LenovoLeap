import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createSessionApi } from "../api/sessions";
import { useAxiosWithAuth } from "../lib/axios";

export const useCreateSession = () => {
  const axiosInstance = useAxiosWithAuth();
  const sessionApi = createSessionApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
  });

  return result;
};

export const useActiveSessions = () => {
  const axiosInstance = useAxiosWithAuth();
  const sessionApi = createSessionApi(axiosInstance);

  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });

  return result;
};

export const useMyRecentSessions = () => {
  const axiosInstance = useAxiosWithAuth();
  const sessionApi = createSessionApi(axiosInstance);

  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });

  return result;
};

export const useSessionById = (id) => {
  const axiosInstance = useAxiosWithAuth();
  const sessionApi = createSessionApi(axiosInstance);

  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = () => {
  const axiosInstance = useAxiosWithAuth();
  const sessionApi = createSessionApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  const axiosInstance = useAxiosWithAuth();
  const sessionApi = createSessionApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
  });

  return result;
};

// Hook to get an auth-aware sessionApi instance for use in non-hook contexts like useStreamClient
export const useSessionApi = () => {
  const axiosInstance = useAxiosWithAuth();
  return createSessionApi(axiosInstance);
};
