import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createAiApi } from "../api/ai";
import { useAxiosWithAuth } from "../lib/axios";

export const useAiAssist = () => {
  const axiosInstance = useAxiosWithAuth();
  const aiApi = createAiApi(axiosInstance);

  return useMutation({
    mutationFn: aiApi.getAiAssist,
    onError: (error) => {
      console.error("AI Assist error:", error);
      toast.error(error?.response?.data?.message || "Failed to generate AI insights.");
    },
  });
};
