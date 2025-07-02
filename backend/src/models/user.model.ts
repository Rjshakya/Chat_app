import mongoose, { Model, Schema } from "mongoose";

const userScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      default: null,
      unique: true,
      index: true,
    },
    picture: {
      type: String,
    },
    oauth: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    last_loggedIn: {
      type: String,
      default: null,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const User = mongoose.model("users", userScheme);

export default User;
