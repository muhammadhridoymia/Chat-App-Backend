import express from "express"
import upload from "../Middleware/Cloudinary"
import { FileUploader } from "../controllers/fileUploadControllers"

const router = express.Router();
router.post("uplad/img",upload.fields([{name:"image"}]),FileUploader)
export default router;
