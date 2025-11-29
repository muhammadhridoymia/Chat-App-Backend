import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatUser", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatUser", required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("ChatMessage", messageSchema);
    