
import { DefaultEventsMap, ExtendedError, Socket } from "socket.io";

import { verifyToken } from "../lib/jwt.js";

export const socketMiddleware = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError) => void
) => {
     try {
        const cookies = socket.handshake.headers.cookie;
    
        const tokens = cookies?.split("accessToken=")[1] || "";
        const accessToken = tokens?.split("; refreshToken")[0];
    
        if (!accessToken) {
          next(new Error("no token found"));
        }
    
        const payload = await verifyToken(accessToken);
    
        socket.userID = `${payload?.id}`;
    
        socket.user = {
          id: `${payload?.id}`,
          name: payload?.name || "",
          email: payload?.email || "",
          role: payload?.role || "",
          picture: payload?.picture || "",
        };
    
        next();
      } catch (error) {
        next(new Error(`${error}`));
      }
};


