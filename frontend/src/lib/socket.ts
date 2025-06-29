import { socket_events } from "@/services/socket/socket.service";
import { io } from "socket.io-client";

const uri = `${import.meta.env.VITE_BACKEND_URL}`;

export const socket = io(uri, {
  autoConnect: false,
  withCredentials: true,

})

export const socket_services = new socket_events(socket);

socket.on("connect_error", (err) => socket_services.on_connect_err(err));

socket.on("received:pvt_msg", (msg) => socket_services.onMsg(msg));

socket.on("received:group_msg", (msg) => socket_services.onGroupMsg(msg));

socket.on("offline", (sender) => socket_services.onOffline(sender));

socket.on("online", (sender) => socket_services.onOnline(sender));


