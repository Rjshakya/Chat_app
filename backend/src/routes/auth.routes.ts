import express from "express";
import { signupcontroller } from "../controllers/auth/signup.controller.js";
import { loginController } from "../controllers/auth/login.controller.js";
import { refreshTokenController } from "../controllers/auth/refresh.token.controller.js";
import { authMe } from "../controllers/auth/auth.me.js";
import { checkAuthMiddleWare } from "../middlewares/auth.middle.js";
import { logout } from "../controllers/auth/logout.contoller.js";

export const authRouter = express.Router();

authRouter.post("/signup", signupcontroller);
authRouter.post("/login", loginController);
authRouter.get("/refresh", refreshTokenController);
authRouter.get("/me", checkAuthMiddleWare, authMe);
authRouter.get("/logout", checkAuthMiddleWare, logout);
