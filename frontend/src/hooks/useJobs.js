import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createJobsApi } from "../api/jobs";
import { useAxiosWithAuth } from "../lib/axios";

// ---- jobs ----
export const useJobs = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useQuery({
    queryKey: ["jobs"],
    queryFn: jobsApi.getJobs,
  });

  return result;
};

export const useJobStats = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useQuery({
    queryKey: ["jobStats"],
    queryFn: jobsApi.getJobStats,
  });

  return result;
};

export const useJob = (id) => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  });

  return result;
};

export const useCreateJob = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["createJob"],
    mutationFn: jobsApi.createJob,
    onSuccess: () => toast.success("Job posted successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to post job"),
  });

  return result;
};

export const useUpdateJobStatus = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["updateJobStatus"],
    mutationFn: jobsApi.updateJobStatus,
    onSuccess: () => toast.success("Job status updated!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update job"),
  });

  return result;
};

export const useDeleteJob = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["deleteJob"],
    mutationFn: jobsApi.deleteJob,
    onSuccess: () => toast.success("Job deleted"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete job"),
  });

  return result;
};

// ---- candidates ----
export const useCandidates = (jobId, status) => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useQuery({
    queryKey: ["candidates", jobId, status || "all"],
    queryFn: () => jobsApi.getCandidates({ jobId, status }),
    enabled: !!jobId,
    refetchInterval: 8000, // surface re-scores / status changes without a manual refresh
  });

  return result;
};

export const useUploadResume = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["uploadResume"],
    mutationFn: jobsApi.uploadResume,
    onSuccess: () => toast.success("Resume screened!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to screen resume"),
  });

  return result;
};

export const useUpdateCandidateStatus = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["updateCandidateStatus"],
    mutationFn: jobsApi.updateCandidateStatus,
    onSuccess: () => toast.success("Candidate updated!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update candidate"),
  });

  return result;
};

export const useRescoreCandidate = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["rescoreCandidate"],
    mutationFn: jobsApi.rescoreCandidate,
    onSuccess: () => toast.success("Candidate re-scored!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to re-score candidate"),
  });

  return result;
};

export const useInviteCandidate = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["inviteCandidate"],
    mutationFn: jobsApi.inviteCandidate,
    onSuccess: () => toast.success("Interview session created!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create interview"),
  });

  return result;
};

export const useDeleteCandidate = () => {
  const axiosInstance = useAxiosWithAuth();
  const jobsApi = createJobsApi(axiosInstance);

  const result = useMutation({
    mutationKey: ["deleteCandidate"],
    mutationFn: jobsApi.deleteCandidate,
    onSuccess: () => toast.success("Candidate removed"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to remove candidate"),
  });

  return result;
};
