import { socket, socket_services } from "@/lib/socket";
import { handle_get_recent_chat } from "@/services/chat/chat.service";
import { handle_get_groups } from "@/services/group/handle.group";
import type { user } from "@/store/authStore";
import type { UserObj } from "@/store/usersStore";
import { useEffect } from "react";

type Params = {
  user: user | null;
  receiver: UserObj | null;
  chat: string;
};

export const useJoinChat = ({ user, receiver, chat }: Params) => {
  useEffect(() => {
    if (!socket.connected) return;

    let clearTime: NodeJS.Timeout | null;

    if (user && receiver && chat) {
      clearTime = setTimeout(() => {
        socket_services.ev_join_chat({
          id: chat,
          sender: user?._id,
          receiver: receiver?._id,
        });
      }, 500);
    }

    return () => {
      if (clearTime) clearTimeout(clearTime);
    };
  }, [socket.connected, chat]);
};


export const useUsersGroups = ({ user }: { user: user | null }) => {
  useEffect(() => {
    async function fetch_user_grps() {
      if (!user) return;
      const chats = await handle_get_recent_chat(user?._id);
      await handle_get_groups(user?._id, chats);
    }

    fetch_user_grps();
  }, [user]);
};
