import type { IChat } from "@/components/custom/ChatUI";
import {
  handle_create_new_chat,
  handle_save_in_recent_chat,
} from "@/services/chat/chat.service";
import useChatStore from "@/store/chatStore";
import type { UserObj } from "@/store/usersStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { socket_services } from "./socket";
import type { NavigateFunction } from "react-router";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handle_chat = async (
  senderId: string,
  receiverId: string,
  user: UserObj, /* this is receiver user as UserObj*/ 
  navigate: NavigateFunction,
  u:UserObj /** this is sender as UserObj */
) => {

  if (!senderId && !receiverId && !user) {
    return;
  }

  try {
    const chat: IChat = await handle_create_new_chat(senderId, receiverId);
    useChatStore.setState({ receiver: user });

    socket_services.ev_join_chat({
      id: chat?._id,
      sender: u?._id,
      receiver: receiverId,
    });

    handle_save_in_recent_chat(chat?._id, senderId, receiverId, user?._id!);
    navigate(`/dashboard?chat=${chat?._id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const handle_group_chat = async (chatID: string) => {
    
  

// }
