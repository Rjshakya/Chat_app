import googleOauthClient, { getUserInfo } from "../lib/googleAuth.js";
import authRepo from "../repositaries/auth.js";
import { userSchemeValidation } from "../validatons/user.validaton.js";
import { Request } from "express";

interface Iuser {
  _id?: string;
  name?: string;
  email?: string;
  picture?: string | null;
  oauth?: string;
  role?: string;
  last_loggedIn?: string;
  isOnline?: boolean;
  username?: string | null;
}

export class AuthService {
  async googleLoginService(code: string): Promise<Iuser | undefined> {
    try {
      const { tokens } = await googleOauthClient.getToken(code);
      const {
        email = "",
        name = "",
        picture = "",
      } = await getUserInfo(googleOauthClient, tokens);

      let user = await authRepo.getUserbyEmail(email);
      const username = user?.email?.split("@")[0];

      if (!user) {
        user = await authRepo.createUser({
          email,
          name,
          picture,
          oauth: "google",
          last_loggedIn: `${Date.now()}`,
          username,
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logoutService(id: string) {
    await authRepo.updateUser({ isOnline: false }, id);
  }

  async getUserByID(id: string) {
    return await authRepo.getUserbyId(id);
  }

  async updateUsername(id: string, username: string) {
    return await authRepo.updateUser({ username: username }, id);
  }

  async getUsername(email: string) {
    return await authRepo.getUsernamebyEmail(email);
  }
}

export const authService = new AuthService();
