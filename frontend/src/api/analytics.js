export const createAnalyticsApi = (axiosInstance) => ({
  getMyAnalytics: async () => {
    const response = await axiosInstance.get("/analytics");
    return response.data;
  },
});
