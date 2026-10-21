export const createAiApi = (axiosInstance) => ({
  getAiAssist: async ({ prompt = "", mode = "explain", code = "", language = "javascript" }) => {
    const response = await axiosInstance.post("/ai/assist", {
      prompt,
      mode,
      code,
      language,
    });
    return response.data;
  },
});
