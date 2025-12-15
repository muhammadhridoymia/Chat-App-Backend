import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessages.js";

export const createGroup = async (req, res) => {
  try {
    const { userId,name, members } = req.body;
    console.log(userId, name, members);

    const group = await Group.create({
      name,
      members: [...members, userId],
      admins: [userId],
      createdBy: userId
    });

    res.status(201).json({ message: "Group created successfully"});
  } catch (err) {
    res.status(500).json({ message: "Group creation failed" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const groups = await Group.find({
      members: userId
    }).sort({ createdAt: -1 }); // latest first

    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Failed to load groups" });
  }
};

//Old Group Message
export const getOldGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log("groupId:",groupId);
    const messages = await GroupMessage.find({ groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load old messages" });
  }
};