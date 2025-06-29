import { Request, Response, RequestHandler } from "express";
import googleOauthClient, { getUserInfo } from "../../lib/googleAuth.js";
import User from "../../models/user.model.js";
import { createTokens } from "../../lib/jwt.js";

export const loginController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.body;
    const { tokens } = await googleOauthClient.getToken(code);

    const { email, name, picture } = await getUserInfo(
      googleOauthClient,
      tokens
    );

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        oauth: "google",
      });
    }

    const Payload = {
      name: user?.name,
      email: user?.email,
      id: user?._id,
      role: user?.role,
      picture:user?.picture!
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
