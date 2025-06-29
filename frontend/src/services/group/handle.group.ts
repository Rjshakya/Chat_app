import api from "@/lib/axios";
import { type IGroupUser } from "../../components/custom/GroupDialog";
import useChatStore from "@/store/chatStore";
import useGroupStore from "@/store/groupStore";
import { useMessageStore } from "@/store/messageStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Group_uri = `${BACKEND_URL}/groups`;

export const handle_create_new_group = async (
  admin: string,
  members: IGroupUser[],
  title: string
) => {
  if (!admin && !members && !title) return;

  try {
    const res = await api.post(`${Group_uri}/create`, {
      admin,
      members,
      title,
    });

    if (res.status === 201) {
      console.log(res?.data?.group);

      return res.data?.group;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handle_get_groups = async (user: string, chats?: any) => {
  try {
    const res = await api.get(`${Group_uri}/users`, {
      params: { user },
    });

    if (res.status === 200 && res.data?.groups) {
      if (chats) {
        const copyArr = [...chats, ...res.data?.groups];
        useChatStore.setState({ recent_chats: copyArr });
      }

      useGroupStore.setState({ groups: res.data?.groups });

      return res.data?.groups;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handle_get_group = async (id: string) => {
  if (!id) return;
  try {
    const res = await api.get(`${Group_uri}/`, {
      params: { id },
    });

    if (res.status === 200) {
      useGroupStore.setState({ group: res?.data?.group });
      return res?.data?.group;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handle_get_group_messages = async (group: string) => {
  if (!group) return;

  try {
    const res = await api.get(`${Group_uri}/messages`, {
      params: { group },
    });

    if (res.status === 200) {
      useMessageStore.setState({ messages: res.data?.messages });
      
      
      return res.data?.messages;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
