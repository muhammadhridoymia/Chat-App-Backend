import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/:senderId/:receiverId", async (req, res) => {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    }).sort({ createdAt: 1 });

    res.json(messages);
});

export default router;
