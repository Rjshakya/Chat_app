import mongoose, { Schema } from "mongoose";

const group = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("groups", group);
export default Group;
