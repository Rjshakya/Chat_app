import mongoose, { Schema } from "mongoose";

const messageScheme = new Schema(
  {
    content: {
      type: String,
    },
    image: {
      type: String,
      default: null,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },
    group:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", messageScheme);
export default Message;
