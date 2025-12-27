import mongoose from "mongoose";
import { type } from "os";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatUser", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatUser", required: true },
  message: { type: String,},
  img:[],
  voice:{type:String},
  seen:{type:Boolean,default:false},
}, { timestamps: true });

export default mongoose.model("ChatMessage", messageSchema);
    