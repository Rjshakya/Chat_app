import { DefaultEventsMap, Socket } from "socket.io";

import Message from "../../models/message.model.js";
import { kafkaClient } from "../kafka/client.js";
import Group from "../../models/group.model.js";
import mongoose from "mongoose";
import { UserType } from "../../types/common.types.js";
import { socketIO } from "../../app.js";
import { produceMessage } from "../kafka/producers.js";
declare module "socket.io" {
  interface Socket {
    userID: string;
    user: UserType;
    chat: {
      _id: string;
      sender: string;
      receiver: string;
    };
  }
}

export interface Message {
  content: string;
  receiver: string | string[];
  sender: string;
  chat?: string;
  group?: string;
}

export const personalMessageMap = new Map<string, string>();

export class socketServices {
  userSocket: Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  > | null;

  constructor(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    
    this.userSocket = socket;
  }

  public async onDisconnect() {
    console.log("user disconnected");
    personalMessageMap.delete(this.userSocket?.user?.id!);

    await kafkaClient.produceUserEvent({
      last_loggedIn: Date.now(),
      online: false,
      user: this.userSocket?.user!,
    });

    if (this?.userSocket?.chat) {
      console.log("after disconnected", this?.userSocket?.chat);

      const receiverSocket = personalMessageMap.get(
        this?.userSocket?.chat?.receiver
      );

      if (receiverSocket) {
        socketIO
          ?.to(receiverSocket)
          .emit("offline", this.userSocket?.chat?.sender);
      }
    }
  }

  public async onPersonalMessage(msg: Message) {
    
    
    const receiverSocketID = personalMessageMap.get(msg.receiver[0]);
    console.log(receiverSocketID);
    
    try {
      await produceMessage(msg);
      socketIO?.to(receiverSocketID!).emit("received:pvt_msg", msg)
    } catch (error) {
      this.userSocket?._error("server failed to send msg");
      console.log(error);
      
    }
  }

  public async onChat(chat: any) {
    if (!this.userSocket) return;
    this.userSocket.chat = chat;

    const receiverSocketID = personalMessageMap.get(
      this.userSocket?.chat?.receiver
    );
    socketIO
      ?.to(receiverSocketID!)
      .emit("online", this.userSocket?.chat?.sender);
  }

  public async joinGroups(user: string) {
    const groups = await Group.find({
      members: new mongoose.Types.ObjectId(user),
    });

    groups.forEach((g) => {
      this?.userSocket?.join(g?.id);
    });
  }

  public async onGroupMessage(msg: Message) {
    if (!msg) {
      this.userSocket?.emit("error:no_msg");
    }
    if (!msg?.group) return;

    try {
      await kafkaClient.produceMessage(JSON.stringify(msg));
    } catch (error) {
      this.userSocket?._error("server failed to send msg");
      console.log(error);
    }

    const customMessage = {
      ...msg,
      sender: {
        _id: this?.userSocket?.user?.id,
        email: this?.userSocket?.user?.email,
        name: this?.userSocket?.user?.name,
        role: this?.userSocket?.user?.role,
        picture: this?.userSocket?.user?.picture,
      },
    }; // so that frontend can have senders photo and name to show ; in group message

    socketIO
      ?.to(msg?.group)
      .except(this.userSocket?.id!)
      .emit("received:group_msg", customMessage);
  }
}


