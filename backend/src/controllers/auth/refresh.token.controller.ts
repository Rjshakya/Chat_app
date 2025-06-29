import { Request, Response, RequestHandler } from "express";
import { createTokens, verifyToken } from "../../lib/jwt.js";
import User from "../../models/user.model.js";

export const refreshTokenController: RequestHandler = async (req, res) => {
  try {
    const cookies = req?.cookies;
    const oldrefreshToken = cookies["refreshToken"];

    if (!oldrefreshToken) {
      res.status(404).json({
        success: false,
        msg: "unauthorised access : no token found : please login",
        error: true,
      });

      return;
    }

    const verifiedRes = await verifyToken(oldrefreshToken);
    const payload = {
      name: verifiedRes?.name,
      email: verifiedRes?.email,
      id: verifiedRes?.id,
      role: verifiedRes?.role,
      picture: verifiedRes?.picture!,
    };
    const user = await User.findById(payload?.id);

    const { accessToken, refreshToken } = await createTokens(payload!);
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
        success: true,
        msg: "token refreshed",
        user,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Jwt verify error or server error . please login",
      error: true,
    });
  }
};
