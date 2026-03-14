import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Hook that returns an axios instance with the Clerk Bearer token attached.
// Use this inside React components/hooks instead of importing axiosInstance directly.
export const useAxiosWithAuth = () => {
  const { getToken } = useAuth();

  const authAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [getToken]);

  return authAxios;
};

export default axiosInstance;
