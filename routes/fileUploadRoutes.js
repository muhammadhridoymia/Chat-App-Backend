// routes/fileUploadRoutes.js
import express from "express";
import upload from "../Middleware/Cloudinary.js"; // matched folder name
import { FileUploader,VoiceUploader } from "../controllers/fileUploadControllers.js";

const router = express.Router();
router.post("/upload/img", upload.array("images"), FileUploader);
router.post("/upload/voice", upload.single("voice"), VoiceUploader);


export default router;
