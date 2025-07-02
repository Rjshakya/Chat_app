import { create } from "zustand";
import type { UserObj } from "./usersStore";
import { persist } from "zustand/middleware";
import type { IChat, IGroupChat } from "@/components/custom/ChatUI";

interface IchatStore {
  receiver: UserObj | null;
  sender: UserObj | null;
  setReceiver: (receiver: UserObj) => void;
  setOnline: () => void;
  setOffline: () => void;
  recent_chats: IChat[] | IGroupChat[] | [];
  chat: string | null;
}



const useChatStore = create<IchatStore>()(
  persist(
    (set, get) => ({
      chat: null,
      receiver: null,
      sender: null,
      recent_chats: [],
      setReceiver: (receiver) => {
        set({
          receiver,
        });
      },

      setOnline: () => {
        const prev = get()?.receiver;
        set({
          receiver: { ...prev!, isOnline: true },
        });
      },

      setOffline: () => {
        const prev = get()?.receiver;
        set({
          receiver: { ...prev!, isOnline: false },
        });
      },
    }),
    {
      name: "chatStore",

      partialize: (state) => ({
        receiver: state.receiver,
        sender: state.sender,
      }),
    }
  )
);

export default useChatStore;
