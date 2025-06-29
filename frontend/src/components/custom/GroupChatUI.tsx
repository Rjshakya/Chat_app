import { MenuIcon, Phone, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";

import type { UserObj } from "@/store/usersStore";
import { socket_services } from "@/lib/socket";
import { useAuthStore, type user } from "@/store/authStore";
import useGroupStore from "@/store/groupStore";

export interface IChat {
  _id: string;
  sender: string;
  receiver?: UserObj;
  isGroup: boolean;
}

export interface IGroupChat {
  _id: string;
  picture: string;
  title: string;
  admin: string;
  isGroup: boolean;
}

const GroupChatUI = () => {
  const [msgInput, setMsgInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useMessageStore((s) => s);
  const { user } = useAuthStore((s) => s);
  const { group } = useGroupStore((s) => s);

  const handleSendBtn = () => {
    if (!group && !msgInput && !user) return;
    socket_services.sendGroupMsg(
      msgInput,
      group?._id!,
      user?._id!,
      group?.members!
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    handleSendBtn();
    setMsgInput("");
  };

  useEffect(() => {
    if (bottomRef) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className=" w-full h-full chat-container grid grid-cols-1  relative ">
      <div className=" px-4 sticky top-5 z-40 receiver header col-span-full  ">
        <div className=" flex items-center justify-between px-4 bg-muted/30 py-1 rounded-lg shadow gap-8">
          <div className="user details w-full flex items-center justify-between gap-4">
            <div className=" relative">
              <Avatar className=" relative size-10 rounded-2xl ">
                <AvatarImage
                  referrerPolicy="no-referrer"
                  className="bg-muted/30"
                  src={group?.picture || ""}
                  alt={group?.title || "group pic"}
                />

                <AvatarFallback className="bg-muted rounded-lg">
                  CN
                </AvatarFallback>
              </Avatar>
            </div>

            <div className=" flex flex-col  items-start">
              <span className=" text-xs font-medium ">
                {group?.title || "User"}
              </span>
            </div>
          </div>

          <div className="options hidden md:flex items-center gap-1">
            <Button variant={"secondary"}>
              <Phone />
            </Button>
            <Button variant={"secondary"}>
              <MenuIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className=" main chai ui w-full h-full col-span-full p-4 mb-4  relative">
        <div className="  bg-muted/30 rounded-xl h-[70vh]  md:h-[75vh] w-full overflow-y-auto p-4 flex flex-col gap-3 relative pb-12">
          {messages &&
            messages?.length > 0 &&
            messages.map((msg) => {
              const sender = msg?.sender as user;
              return (
                <>
                  <div className="w-full flex gap-2 items-center">
                    <div
                      className={` ${
                        user?._id === sender._id
                          ? "sender-msg ml-auto"
                          : "receiver-msg "
                      }`}
                    >
                      {user?._id === sender?._id ? (
                        <>
                          {msg?.content}
                          <Avatar className=" relative size-6 rounded-2xl ">
                            <AvatarImage
                              referrerPolicy="no-referrer"
                              className="bg-muted/30"
                              src={sender?.picture || ""}
                              alt={sender?.name || "user pic"}
                            />

                            <AvatarFallback className="bg-muted rounded-lg">
                              {sender?.name?.slice(0, 1) || "u"}
                            </AvatarFallback>
                          </Avatar>{" "}
                        </>
                      ) : (
                        <>
                          <Avatar className=" relative size-6 rounded-2xl ">
                            <AvatarImage
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              className="bg-muted/30"
                              src={sender?.picture || ""}
                              alt={sender?.name || "user pic"}
                            />

                            <AvatarFallback className="bg-muted rounded-lg">
                              {sender?.name?.slice(0, 1) || "u"}
                            </AvatarFallback>
                          </Avatar>
                          {msg.content}
                        </>
                      )}
                    </div>
                  </div>
                </>
              );
            })}

          <div ref={bottomRef} className="botton-view" />
        </div>

        <div className="bg-accent/50 chat input absolute z-30  bottom-0 left-0 right-0 w-full p-4 backdrop-blur-sm ">
          <div className="wrapper flex items-center justify-between gap-3">
            <div className=" input-wrapp w-full">
              <Input
                value={msgInput}
                onChange={(e) => setMsgInput(e.currentTarget.value)}
                className="font-medium bg-accent border-0 focus-visible:ring-0 focus-visible:outline-0 h-10"
                type="text"
                placeholder="message"
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>
            <div className="send-btn-wrap">
              <Button
                onClick={handleSendBtn}
                className=" flex items-center justify-between"
              >
                <Send size={10} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatUI;
