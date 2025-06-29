import "dotenv/config";
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
declare module "socket.io" {
  interface Socket {
    userID: string;
    user: UserType;
  }
}

import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";
import { onSocketConnection } from "./services/socket/connection.js";
import { userRouter } from "./routes/user.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { kafkaClient } from "./services/kafka/client.js";
import { listRouter } from "./routes/list.routes.js";
import groupRouter from "./routes/group.routes.js";
import { UserType } from "./types/common.types.js";
import { socketMiddleware } from "./middlewares/socket.auth.middle.js";
import io from "./config/socketConfig.js";
import dbConnection from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 8001;
export const server = createServer(app);
export const socketIO = io(server);

const MONGO_URL = process.env.MONGO_URL || "";
dbConnection(MONGO_URL);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/list", listRouter);
app.use("/groups", groupRouter);

server.listen(PORT, () => {
  socketIO
    ?.use((socket, next) => socketMiddleware(socket, next))
    .on("connection", (socket) => onSocketConnection(socket));
  console.log(`server is up at ${PORT}`);
})

try {
  await kafkaClient.consumeMessage();
  await kafkaClient.consumeUserEvent();
} catch (error) {
  throw new Error("kafka : failed to consume messages");
}
