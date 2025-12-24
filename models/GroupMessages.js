import mongoose from "mongoose";
import { type } from "os";

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: { type: String, required: true },
    img: [],
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("GroupMessage", groupMessageSchema);
