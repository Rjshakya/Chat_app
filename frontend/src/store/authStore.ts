// import { socket } from "@/lib/socket";
import api from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface user {
  _id: string;
  name: string;
  email: string;
  picture: string;
  role: string;
  isOnline:boolean
  
}

interface Auth {
  user: user | null;
  isAuthenticated: boolean;
  justLoggedOut:boolean
  signUp: (userData: user) => void;
  login: (userData: user) => void;
  logout: () => void;
  checkAuth: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const authUri = `${BACKEND_URL}/auth`;

export const useAuthStore = create<Auth>()(
  // @ts-ignore
  persist(
    (set , get) => ({
      user: null,
      isAuthenticated: false,
      justLoggedOut:false,
      signUp: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
      },

      // login method
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
      },

      // log out method
      logout: () => {
        
        set({
          user: null,
          isAuthenticated: false,
          justLoggedOut:true
          
        });

        useAuthStore.persist.clearStorage()
      },

      checkAuth: async () => {
        
        if(get().justLoggedOut){
          set({justLoggedOut:false})
          return;
        }

        try {
          const res = await api.get(`${authUri}/me`);

          if (res.status === 200) {
            useAuthStore.setState({
              isAuthenticated: true,
              user: res.data.user,
            });
          }
        } catch (error) {
          useAuthStore.setState({ isAuthenticated: false, user: null });
          console.log(error);
          throw error;
        }
      },
    }),
    {
      name: "authStore",

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
