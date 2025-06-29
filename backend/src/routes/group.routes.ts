import express from "express";
import { checkAuthMiddleWare } from "../middlewares/auth.middle.js";
import * as group from "../controllers/group/group.controller.js";
import { getGroupMessages } from "../controllers/messages/get.Messages.js";

const groupRouter = express.Router();

groupRouter.post("/create", checkAuthMiddleWare, group.createGroup);
groupRouter.get("/users", checkAuthMiddleWare, group.getUserGroup);
groupRouter.get("/messages", checkAuthMiddleWare, getGroupMessages);
groupRouter.get("/", checkAuthMiddleWare, group.getGroup);
export default groupRouter;
