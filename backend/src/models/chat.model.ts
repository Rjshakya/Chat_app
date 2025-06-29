import mongoose, { Schema } from "mongoose";

const chat = new Schema(
  {
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
  },
  { timestamps: true }
);

const Chat = mongoose.model("chats", chat);
export default Chat;
