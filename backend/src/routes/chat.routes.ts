import express from "express";
import { getChatMessages } from "../controllers/messages/get.Messages.js";
import { checkAuthMiddleWare } from "../middlewares/auth.middle.js";
import * as chat from "../controllers/chats/chat.controllers.js";
export const chatRouter = express.Router();

chatRouter.get("/chat_messages", checkAuthMiddleWare, getChatMessages);
chatRouter.post("/create_chat", checkAuthMiddleWare, chat.createNewChat);
chatRouter.get("/chat_details", checkAuthMiddleWare, chat.getChatDetails);
chatRouter.get("/recent_chat", checkAuthMiddleWare, chat.getRecentChat);
chatRouter.post("/save", checkAuthMiddleWare, chat.saveInRecentChat);
