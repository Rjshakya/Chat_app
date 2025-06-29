"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import type { IChat, IGroupChat } from "./custom/ChatUI";
import { useNavigate } from "react-router";
import { handle_chat } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

import { GroupDialog } from "./custom/GroupDialog";

export function NavMain({ items }: { items: IChat[]|IGroupChat[]|[] }) {
  const navigate = useNavigate();
  const { user } = useAuthStore((s) => s);
  
  

  return (
    <SidebarGroup>
      <SidebarGroupLabel className=" mb-2 flex items-center justify-between">
        <p>Meet in Real time</p>
        <GroupDialog />
      </SidebarGroupLabel>
      <SidebarMenu>
        {items &&
          items.length > 0 &&
          items.map((c) => {
            const isChat = (item: IChat | IGroupChat): item is IChat =>
              (item as IChat).receiver !== undefined;

            return (
              <SidebarMenuItem key={c._id} className="border-2 rounded-xl">
                <SidebarMenuButton
                  size={"lg"}
                  className=""
                  tooltip={
                    isChat(c)
                      ? c.receiver?.name || "user"
                      : (c as IGroupChat).title || "group"
                  }
                  onClick={async () =>
                    isChat(c)
                      ? await handle_chat(
                          c.sender,
                          c.receiver?._id!,
                          c.receiver!,
                          navigate,
                          user!
                        )
                      : navigate(`/dashboard?group=${c?._id}`) // handle group chat click if needed
                  }
                >
                  <div className=" w-full flex items-center gap-6">
                    <div className=" picture size-10 rounded-xl overflow-hidden relative">
                      <Avatar className="">
                        <AvatarImage
                          referrerPolicy="no-referrer"
                          src={
                            isChat(c)
                              ? c.receiver?.picture || "user?.picture"
                              : c?.picture||"group"
                          }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="details flex-1">
                      <span className=" font-medium text-sm">
                        <p>
                          {isChat(c)
                            ? c.receiver?.name || "user"
                            : c.title || "group"}
                        </p>
                      </span>
                      <span className=" text-muted-foreground">
                        <p> latest messages</p>
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
