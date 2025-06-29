import express from "express";
import * as list from "../controllers/list/saved.list.controller.js";
import { checkAuthMiddleWare } from "../middlewares/auth.middle.js";

export const listRouter = express.Router();

listRouter.post("/create", checkAuthMiddleWare, list.createList);
listRouter.post("/add", checkAuthMiddleWare, list.addInList);
