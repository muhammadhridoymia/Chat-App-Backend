import express from "express"
import Message from "../models/Message.js";


export const OldMessage= async (req, res) => {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    }).sort({ createdAt: 1 });

    res.json(messages);
};