import { Socket } from "socket.io";
import { produceUserEvent } from "../kafka/producers.js";
import { personalMessageMap, socketServices } from "./socket.service.js";
import { DefaultEventsMap } from "socket.io";

export const onSocketConnection = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  if (!socket) return;

  const SocketServices = new socketServices(socket);
  personalMessageMap.set(socket?.user.id, socket.id);
  await produceUserEvent(Date.now(), true, socket?.user);
  SocketServices.joinGroups(socket?.user?.id);
  console.log("user connected with socket");

  socket.on("disconnect", () => SocketServices.onDisconnect());
  socket.on("send:pvt_msg", (msg) => SocketServices.onPersonalMessage(msg));
  socket.on("joined_chat", (chat) => SocketServices.onChat(chat));
  socket.on("send:group_msg", (details) =>
    SocketServices.onGroupMessage(details)
  );
};