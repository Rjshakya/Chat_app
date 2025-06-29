import api from "@/lib/axios";
import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const authUri = `${BACKEND_URL}/auth`;

export const handleSignup = async (code: string) => {
  if (!code) {
    return;
  }

  try {
    const res = await api.post(`${authUri}/signup`, {
      code,
    });

    if (res.status === 201) {
      useAuthStore.setState({ isAuthenticated: true, user: res.data?.user });
      socket.connect();
    }
  } catch (error) {
    return error;
  }
};

export const handleLogin = async (code: string) => {
  if (!code) {
    return;
  }

  try {
    const res = await api.post(`${authUri}/login`, {
      code,
    });

    if (res.status === 200) {
      useAuthStore.setState({ isAuthenticated: true, user: res.data?.user });
      socket.connect();
     
    }
  } catch (error) {
    return error;
  }
};

export const handleLogout = async () => {
  try {
    const res = await api.get(`${authUri}/logout`);

    if (res.status === 200) {
      useAuthStore.getState().logout();
      socket.disconnect()
      
    }
  } catch (error) {
    throw error;
  }
};

export const handleRefreshToken = async () => {
  try {
    const response = await api.get(`${authUri}/refresh`);

    if (response.status === 200) {
      return response.data.user
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const checkIsAuthenticated = async () => {
  try {
    const res = await api.get(`${authUri}/me`);

    if (res.status === 200) {
      useAuthStore.setState({ isAuthenticated: true, user: res.data.user });
    }
  } catch (error) {
    throw error
  }
};
