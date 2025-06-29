import { create } from "zustand";
import type { user } from "./authStore";
// import type { user } from "./authStore";

export interface Message {
  receiver: string | string[];
  sender:user|string
  content: string;
  chat?: string;
  group?: string;
}
export interface MessageStore {
  messages: Message[] | [];
  updateMsgs: (msg: Message) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  updateMsgs: (msg: Message) => {
    const arrCopy = [...get().messages];
    arrCopy.push(msg);

    set({
      messages: arrCopy,
    });
  },
}));
