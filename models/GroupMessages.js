import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: String,
  seen:{type:Boolean,default:false},
}, { timestamps: true });

export default mongoose.model("GroupMessage", groupMessageSchema);
