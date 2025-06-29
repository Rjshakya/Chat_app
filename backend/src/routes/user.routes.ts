import express from "express";
import { checkAuthMiddleWare } from "../middlewares/auth.middle.js";
import { getUserProfilePic } from "../controllers/users/user.personal.info.js";
import { handleSearch } from "../controllers/users/user.search.js";

export const userRouter = express.Router();

userRouter.get("/picture", checkAuthMiddleWare, getUserProfilePic);
userRouter.get("/search", handleSearch);
