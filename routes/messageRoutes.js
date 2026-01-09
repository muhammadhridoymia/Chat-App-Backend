import express from "express";
import { OldMessage } from "../controllers/messageSand.js";
const router = express.Router();

router.get("/:senderId/:receiverId", OldMessage);
export default router;