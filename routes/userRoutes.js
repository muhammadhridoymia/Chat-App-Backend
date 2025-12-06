import express from "express";
import { signup, login ,GetAlluser,Finduser} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users/:_id", GetAlluser);
router.get("/find/:gmail",Finduser)

export default router;

