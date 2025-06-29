import { RequestHandler, Request } from "express";
import { verifyToken } from "../lib/jwt.js";
import { AuthRequest } from "../controllers/auth/logout.contoller.js";



export const checkAuthMiddleWare: RequestHandler = async (
  req: AuthRequest,
  res,
  next
) => {
  try {
    const cookies = req.cookies;    
    const accessToken = cookies["accessToken"];

    if (!accessToken) {
      res.status(403).json({
        success: false,
        msg: "unauthorised access",
        error: true,
      });

      return;
    }

    const payload = verifyToken(accessToken)
    .then((d) => d)
    .catch((e) => {
      res.status(401).json({
        success: false,
        msg: "Jwt verify error / expired. please login",
        error: true,
      });
    });


    req.user = await payload;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Jwt verify error or server error . please login",
      error: true,
    });
  }
};
