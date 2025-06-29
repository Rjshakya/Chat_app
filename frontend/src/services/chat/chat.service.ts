// import type { IChat } from "@/components/custom/ChatUI";
import api from "@/lib/axios";
import useChatStore from "@/store/chatStore";
import { useMessageStore } from "@/store/messageStore";
// import { send } from "process";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Chat_uri = `${BACKEND_URL}/chat`;

export const getChatMessages = async (senderID: string, receiverID: string) => {
  if (!senderID && !receiverID) return;
  try {
    const response = await api.get(`${BACKEND_URL}/chat/chat_messages`, {
      params: { sender: senderID, receiver: receiverID },
    });

    if (response.status === 200) {
      console.log(response.data.messages);
      useMessageStore.setState({ messages: response.data.messages });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handle_create_new_chat = async (
  senderId: string,
  receiverId: string
) => {
  try {
    const res = await api.post(`${BACKEND_URL}/chat/create_chat`, {
      senderId,
      receiverId,
    });

    if (res.status === 201) {
      return res.data?.chat;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handle_get_chat_messages = async (chatID: string) => {
  if (!chatID) return;
  try {
    const res = await api.get(`${Chat_uri}/chat_details`, {
      params: { chatID },
    });

    if (res.status === 200) {
      useMessageStore.setState({ messages: res?.data?.messages });
      return res?.data?.messages;
    }
    return undefined;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const handle_save_in_recent_chat = async (
  chat: string,
  sender: string,
  receiver: string,
  chatOwner: string
) => {
  if (!chat && !sender && !receiver && !chatOwner) return;

  try {
    const res = await api.post(`${Chat_uri}/save`, {
      chat,
      sender,
      receiver,
      chatOwner,
    });

    if (res.status === 200) {
      return res.data?.saved;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handle_get_recent_chat = async (chatOwner: string) => {
  if (!chatOwner) return;

  try {
    const res = await api.get(`${Chat_uri}/recent_chat`, {
      params: { chatOwner },
    });

    if (res.status === 200) {
      if (res.data?.recent_chats) {
        useChatStore.setState({
          recent_chats: res.data?.recent_chats,
        });
      }

      return res.data?.recent_chats;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
