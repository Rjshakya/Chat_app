// import type { IChat } from "@/components/custom/ChatUI";
import type { Socket } from "socket.io-client";
import { handleRefreshToken } from "../auth/auth.service";
import { useMessageStore, type Message } from "@/store/messageStore";
import useChatStore from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";

export class socket_events {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public ev_join_chat(chat: { id: string; sender: string; receiver: string }) {
    this.socket.emit("joined_chat", chat);
  }

  public on_connect_err(err: Error) {
    if (err.message.includes("jwt expired")) {
      handleRefreshToken();
    }
  }

  public onMsg(msg: Message) {
    useMessageStore.getState().updateMsgs(msg);
  }

  public onGroupMsg(msg:Message){
    console.log(msg);
    useMessageStore.getState().updateMsgs(msg);
    
  }

  public sendMsg(
    content: string,
    receiver: string,
    sender: string,
    chat: string
  ) {
    const payload = {
      content,
      receiver:[receiver],
      sender,
      chat,
    };

    useMessageStore.getState().updateMsgs(payload);
    this.socket.emit("send:pvt_msg", payload);
  }

  public sendGroupMsg(content: string, group: string  , sender:string , receivers:string[]) {
    const payload = {
      content,
      receiver:receivers,
      sender,
      group,
    };

    // we are using custom payload ; just on client side ; so that messages have sender with its props (e.g ; picture)
    const customPayload = {...payload , sender:useAuthStore.getState().user!}
    useMessageStore.getState().updateMsgs(customPayload);
    this.socket.emit("send:group_msg", payload);
  }

  public onOffline(receiver: any) {
    if (useChatStore.getState().receiver?._id === receiver) {
      console.log(receiver);
      useChatStore.getState().setOffline();
    }
  }

  public onOnline(receiver: any) {
    if (useChatStore.getState().receiver?._id === receiver) {
      console.log(receiver);
      useChatStore.getState().setOnline();
    }
  }
}
