import express from "express";
import { createGroup ,getMyGroups,getOldGroupMessages} from "../controllers/GroupController.js";

const router = express.Router();
router.post("/create/group", createGroup);
router.get("/my/groups/:userId", getMyGroups);
router.get("/old/group/messages/:groupId", getOldGroupMessages);
export default router;
