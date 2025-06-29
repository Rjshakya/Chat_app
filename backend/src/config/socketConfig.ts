import { Server } from "socket.io";

const io = (server: any) => {
  if(!server)return;
  const ioSocket = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  

  return ioSocket;
};

export default io
