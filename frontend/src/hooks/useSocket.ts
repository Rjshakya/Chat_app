import { socket } from "@/lib/socket";
import { useEffect } from "react";

const useSocket = (isAuthenticated: boolean) => {
  useEffect(() => {
    if (!socket) return;

    if (isAuthenticated) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);
};

export default useSocket;
