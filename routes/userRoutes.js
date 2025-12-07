import express from "express";
import { signup, login ,GetAlluser,Finduser,FriendRequest,LoadFriendsRequest,AcceptRequest,SendFriends} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users/:_id", GetAlluser);
router.get("/find/:gmail",Finduser)
router.post("/friend/request",FriendRequest)
router.get("/load/friend/request/:userId",LoadFriendsRequest)
router.post("/friend/request/accept",AcceptRequest)
router.get("/friends/:userId",SendFriends)

export default router;

