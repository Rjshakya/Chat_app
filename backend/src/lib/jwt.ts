import jwt from "jsonwebtoken";
import { Types } from "mongoose";


interface User {
  name?: string;
  email?: string;
  id?: Types.ObjectId
  role?: string;
  picture:string
}

const secretKey = `${process.env.JWTSECRET}`;

export const createTokens = async (user: User) => {
  try {
    const accessToken = jwt.sign(user, secretKey, { expiresIn: "10m" });
    const refreshToken = jwt.sign(user, secretKey, { expiresIn: "7d" });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
    throw new Error("failed in creating jwt");
  }
};

export const verifyToken = async (token: string) => {
  try {
    const user = jwt.verify(token, secretKey) as User;
    
    if (!user) {
      return;
    }

    return user;
  } catch (error) {
    console.log( 'from verifytoken' ,error);
    throw error
  }
};
