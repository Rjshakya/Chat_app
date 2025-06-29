import api from "@/lib/axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const getUserPicture = async (id: string) => {
  try {
    const response = await api.get(`${BACKEND_URL}/user/picture`, {
      params: { id },
    });

    if (response.status === 200) {
      return response.data?.user;
    }

    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchUSer = async (email: string) => {
  try {
    const res = await api.get(`${BACKEND_URL}/user/search`, {
      params: { email: email.trim() },
    });

    if (res.status === 200) {
      return res.data?.search
    }
  } catch (error) {
    console.log(error);
  }
};
