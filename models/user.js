import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isonline: { type: Boolean, default: false },
    profilePic: {String},
    socketId: { type: String },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatUser"
        }
    ],
    friendRequests: [
        {
            fromUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ChatUser"
            },
            createdAt: { type: Date, default: Date.now }
        }
    ]
} , { timestamps: true });

export default mongoose.model("ChatUser", userSchema);
