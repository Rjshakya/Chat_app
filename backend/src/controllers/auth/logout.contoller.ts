import { RequestHandler, Request } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const logout: RequestHandler = async (req: AuthRequest, res) => {
  try {
    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({
        success: true,
        msg: "logout success",
      });

    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "server error",
    });
  }
};
