import { Dot, MenuIcon, Phone, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/messageStore";

import type { UserObj } from "@/store/usersStore";
import { socket_services } from "@/lib/socket";
import useChatStore from "@/store/chatStore";

export interface IChat {
  _id: string;
  sender: string;
  receiver?: UserObj;
  group: boolean;
}

export interface IGroupChat {
  _id: string;
  picture: string;
  title: string;
  admin: string;
  isGroup: boolean;
}

const ChatUI = ({
  chat,
  senderID,
}: {
  chat: string;
  senderID: string | undefined;
  
}) => {
  const [msgInput, setMsgInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useMessageStore((s) => s);
  const { receiver: receiverUser } = useChatStore((s) => s);

  const handleSendBtn = () => {
    if (!msgInput && !receiverUser?._id && !senderID && !chat) return;
    socket_services.sendMsg(msgInput, receiverUser?._id!, senderID!, chat);
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
                  src={receiverUser?.picture || ""}
                  alt={receiverUser?.name || "receiver pic"}
                />

                <AvatarFallback className="bg-muted rounded-lg">
                  CN
                </AvatarFallback>
              </Avatar>

              {receiverUser?.isOnline && (
                <span className="flex items-center justify-center absolute z-30 -top-2 -left-1">
                  <Dot size={80} color="green" />
                </span>
              )}
            </div>

            <div className=" flex flex-col  items-start">
              <span className=" text-xs font-medium ">
                {receiverUser?.name || "User"}
              </span>
              <span className="text-xs opacity-30">
                {" "}
                {receiverUser?.last_LoggedIn || "2hrs ago"}
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
              
              return (
                <>
                  <div className="w-full">
                    <div
                      className={` ${
                        senderID === msg.sender
                          ? "sender-msg ml-auto"
                          : "receiver-msg "
                      }`}
                    >
                      {msg.content}
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

export default ChatUI;
