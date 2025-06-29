import { AppSidebar } from "@/components/app-sidebar";
import ChatUI from "@/components/custom/ChatUI";
import GroupChatUI from "@/components/custom/GroupChatUI";
import SearchComponent from "@/components/custom/SearchComponent";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useJoinChat, { useUsersGroups } from "@/hooks/usejoinchatandgroup";
import { socket } from "@/lib/socket";
import { handle_get_chat_messages } from "@/services/chat/chat.service";
import { handle_get_group, handle_get_group_messages } from "@/services/group/handle.group";
import { useAuthStore } from "@/store/authStore";
import useChatStore from "@/store/chatStore";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export const Dashboard = () => {
  const { isAuthenticated, user, checkAuth } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const [showChatUI, setShowChatUI] = useState(false);
  const [chat, setChat] = useState("");
  const { receiver } = useChatStore((s) => s);
  const [showGroup, setShowGroup] = useState<boolean>();

  const [searchParams, _] = useSearchParams();

  const handleChat = async () => {
    if (!searchParams.get("chat")) {
      setShowChatUI(false);
      return;
    }

    const chatID = searchParams.get("chat");
    setChat(chatID!);

    try {
      await handle_get_chat_messages(chatID!);
      setShowChatUI(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroup = async () => {
    if (!searchParams.get("group")) {
      setShowGroup(false);
      return;
    }

    // fetch group
    const groupID = searchParams.get("group");

    try {
      await handle_get_group(groupID!);
      await handle_get_group_messages(groupID!)
      setShowGroup(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else {
      socket.connect();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    handleChat();
    handleGroup();
  }, [searchParams]);

  useJoinChat({ user, receiver, chat });
  useUsersGroups({ user });

  return (
    <main className="">
      <SidebarProvider>
        <AppSidebar className="" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>

          {(showGroup || showChatUI)|| (
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex flex-col items-center justify-center ">
                <SearchComponent forModal={false} />
              </div>
            </div>
          )}

          {showChatUI && <ChatUI chat={chat!} senderID={user?._id} />}

          {showGroup && <GroupChatUI />}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
};
