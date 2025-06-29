import { handleRefreshToken } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const api = axios.create({
  url: import.meta.env.VITE_BACKEND_URL || " ",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err: any) => {
    const originalReq = err.config;

    if (err.response && err.response.status === 401 && !originalReq?._retry) {
      try {
        originalReq._retry = true

        const user = await handleRefreshToken();

        if (!user) {
          useAuthStore.getState().logout();
        }

        useAuthStore.getState().login(user);

        return api(originalReq);
      } catch (error) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
