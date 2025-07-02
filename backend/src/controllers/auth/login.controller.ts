import { Request, Response, RequestHandler } from "express";
import { createTokens, User } from "../../lib/jwt.js";
import { authService } from "../../services/authService.js";
import mongoose from "mongoose";

export const loginController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { code, username } = req.body;
    const user = await authService.googleLoginService(code);

    const Payload = {
      name: user?.name,
      email: user?.email,
      id: new mongoose.Types.ObjectId(user?._id),
      role: user?.role,
      picture: user?.picture!,
    };

    const { accessToken, refreshToken } = await createTokens(Payload);

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        domain: "localhost",
        path: "/",
        maxAge: 12 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        domain: "localhost",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        user,
        success: true,
        msg: "user login success",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: true,
      msg: "failed to login , server error",
    });
  }
};
