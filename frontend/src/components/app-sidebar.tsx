import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import useChatStore from "@/store/chatStore";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    picture: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore((state) => state);
  const { recent_chats } = useChatStore((s) => s);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={recent_chats && recent_chats} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
