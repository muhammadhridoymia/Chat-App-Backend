// socketControllers/sendMessage.js
import Message from "../models/Message.js";
import User from "../models/user.js";
import Group from "../models/Group.js";
import GroupMessage from "../models/GroupMessages.js";


//Send Friends Message
export const Sendmessage = (io) => {
    return async (data) => {
        const { senderId, receiverId, message } = data;
        console.log("data of message sander:",senderId,receiverId,message)

        if (!senderId || !receiverId || !message || message.trim() === "") return;

        try {
            const newMessage = new Message({ senderId, receiverId, message });
            const saved = await newMessage.save();

            if (saved) {
                // Emit only to sender and receiver
                io.to(senderId).to(receiverId).emit("receiveMessage", saved);
            }
        } catch (err) {
            console.log("Error saving message:", err);
        }
    }
}

//Send Group Message
export const SendGroupMessage = (io) => {
  return async (data) => {
    const { senderId, groupId, message } = data;
    console.log("data of group message sander:",senderId,groupId,message)
  // Save message in DB
  const msg = await GroupMessage.create({
    senderId,
    groupId,
    message,
  });
  // Find group members
  const group = await Group.findById(groupId);
  group.members.forEach(memberId => {
    io.to(memberId.toString()).emit("receiveGroupMessage", msg);
  });
};
}

//Join Room
    export const joinRoom = (socket) => {
    return async (userId) => {
        socket.join(userId);
        console.log(`${userId} joined their private room`);
        //make user online status
        await User.findByIdAndUpdate(userId, {
        isonline: true,
        socketId: socket.id,
    });
    }
}

// Make user off line status
    export const OffLine = (socket) => {
    return async () => {
        console.log("user is off line :",socket.id)
        await User.findOneAndUpdate(
            { socketId: socket.id },
            { isonline: false }
        );
    }
 }