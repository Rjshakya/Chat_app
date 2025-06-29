import { RequestHandler } from "express";
import { AuthRequest } from "./logout.contoller.js";
import User from "../../models/user.model.js";

export const authMe: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const user = req.user;

    
    if (!user) {
      res.status(400).json({
        success: true,
        msg: "no user found please login // bad request",
      });

      return;
    }

    const userInDB = await User.findById(user?.id);
    if (!userInDB) {
      res.status(404).json({
        success: true,
        msg: "no user found please login",
      });
    }

    res.status(200).json({
      success: true,
      msg: "success",
      user: userInDB,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "server error",
    });
  }
};
