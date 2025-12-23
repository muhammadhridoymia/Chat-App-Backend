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

router.post("/make/message/seen", async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log("Marking seen:", senderId, receiverId);

  try {
    const result = await Message.updateMany(
      { senderId, receiverId, seen: false },
      { $set: { seen: true } }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

