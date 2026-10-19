// Factory: pass in an authenticated axios instance (with Bearer token)
export const createJobsApi = (axiosInstance) => ({
  // ---- jobs ----
  getJobs: async () => {
    const response = await axiosInstance.get("/jobs");
    return response.data;
  },

  getJobStats: async () => {
    const response = await axiosInstance.get("/jobs/stats");
    return response.data;
  },

  getJobById: async (id) => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data) => {
    const response = await axiosInstance.post("/jobs", data);
    return response.data;
  },

  updateJobStatus: async ({ id, status }) => {
    const response = await axiosInstance.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
  },

  // ---- candidates ----
  getCandidates: async ({ jobId, status } = {}) => {
    const params = { jobId };
    if (status) params.status = status;
    const response = await axiosInstance.get("/candidates", { params });
    return response.data;
  },

  uploadResume: async ({ jobId, file, name }) => {
    const formData = new FormData();
    formData.append("jobId", jobId);
    if (name) formData.append("name", name);
    formData.append("resume", file);
    // NOTE: don't set Content-Type — the auth interceptor only adds Authorization,
    // so the browser sets the correct multipart boundary automatically.
    const response = await axiosInstance.post("/candidates", formData);
    return response.data;
  },

  updateCandidateStatus: async ({ id, status }) => {
    const response = await axiosInstance.patch(`/candidates/${id}/status`, { status });
    return response.data;
  },

  rescoreCandidate: async (id) => {
    const response = await axiosInstance.post(`/candidates/${id}/rescore`);
    return response.data;
  },

  inviteCandidate: async (id) => {
    const response = await axiosInstance.post(`/candidates/${id}/invite`);
    return response.data;
  },

  deleteCandidate: async (id) => {
    const response = await axiosInstance.delete(`/candidates/${id}`);
    return response.data;
  },
});
