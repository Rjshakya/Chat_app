import mongoose, { Model } from "mongoose";
import User from "../models/user.model.js";

export interface Iuser {
  name?: string;
  email?: string;
  picture?: string | null;
  oauth?: string;
  role?: string;
  last_loggedIn?: string;
  isOnline?: boolean;
  username?: string | null;
}

class authError extends Error {
  public static error(message: string) {
    throw new Error("auth repo error" + message);
  }
}

class AuthRepo {
  model: typeof User;
  constructor(model: typeof User) {
    this.model = model;
  }

  async createUser(user: Iuser): Promise<Iuser | undefined> {
    try {
      const newUser = await this.model.create(user);
      return newUser as Iuser;
    } catch (error) {
      authError.error("create new user");
      return undefined;
    }
  }

  async updateUser(data: Iuser, id: string) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      authError.error("update user");
    }
  }

  async getUserbyId(id: string): Promise<Iuser | undefined | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      authError.error("get user by id");
    }
  }

  async getUserbyEmail(email: string): Promise<Iuser | undefined | null> {
    try {
      const user = await this.model.findOne().where({ email: email });
      if(user && !user?.username){
         const userName = user?.email?.split("@")[0]
         user.username = userName
         await user.save()
      }
      return user as Iuser;
    } catch (error) {
      authError.error("get user by email");
    }
  }

  async deleteUserbyId(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      authError.error("delete user by id");
    }
  }

  async getUsernamebyEmail(email: string) {
    try {
      return this.model.findOne().where({ email: email }).select("username");
    } catch (error) {
      authError.error("get username by email");
    }
  }
}

const authRepo = new AuthRepo(User);
export default authRepo;
