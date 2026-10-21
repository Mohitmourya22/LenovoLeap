export const createSubmissionsApi = (axiosInstance) => ({
  createSubmission: async (data) => {
    const response = await axiosInstance.post("/submissions", data);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await axiosInstance.get("/submissions/me");
    return response.data;
  },
});
