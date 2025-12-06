import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isonline: { type: Boolean, default: false },
    profilePic: {String},
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    friendRequests: [
        {
            fromUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            createdAt: { type: Date, default: Date.now }
        }
    ]
} , { timestamps: true });

export default mongoose.model("ChatUser", userSchema);
