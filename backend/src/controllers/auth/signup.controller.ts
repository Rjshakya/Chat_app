import { Request, Response, RequestHandler } from "express";
import googleOauthClient, { getUserInfo } from "../../lib/googleAuth.js";
import User from "../../models/user.model.js";
import { createTokens } from "../../lib/jwt.js";

export const signupcontroller: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.body;

    const { tokens } = await googleOauthClient.getToken(code);

    const { name, email, picture } = await getUserInfo(
      googleOauthClient,
      tokens
    );

    const userExisted = await User.findOne({ email });

    if (userExisted) {
      res.status(308).json({
        success: false,
        msg: "user existed",
        redirect: "/login",
      });
    }

    const createUser = await User.create({
      name,
      email,
      picture,
      oauth: "google",
    });

    const Payload = {
      name: createUser?.name,
      email: createUser?.email,
      id: createUser?._id,
      role: createUser?.role,
      picture:createUser?.picture!
    };

    const { accessToken, refreshToken } = await createTokens(Payload);

    res
      .status(201)
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
        msg: "user signup/login success",
        createUser,
      })

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: true,
      msg: "server error in signup",
    });
  }
};
