import mongoose, { Schema } from "mongoose";

const recent_chat = new Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    chatOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const Recent_Chat = mongoose.model("saved_lists", recent_chat);
export default Recent_Chat;
