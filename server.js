import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import Message from "./models/Message.js";
import messageRoutes from "./routes/messageRoutes.js"
import { Sendmessage,joinRoom ,OffLine,SendGroupMessage} from "./socketControllers.js/sendMessage.js";
import groupRoutes from "./routes/GroupRoute.js";
import Group from "./models/Group.js";
import fileUploader from "./routes/fileUploadRoutes.js"
dotenv.config();

// Basic express setup
const app = express();
app.use(cors());
app.use(express.json());


// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.get("/", (req, res) => {res.send("Chat backend is running.");});
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", groupRoutes);
app.use("/api/users",fileUploader)

// Create HTTP server for socket.io
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join private room (use user ID as room name)
    socket.on("joinRoom",joinRoom(socket));





    io.on("connection", (socket) => {

  socket.on("call-user", ({ from, to }) => {
    io.to(to).emit("incoming-call", { from });
  });

  socket.on("accept-call", ({ to }) => {
    io.to(to).emit("call-accepted");
  });

  socket.on("reject-call", ({ to }) => {
    io.to(to).emit("call-rejected");
  });

  socket.on("end-call", ({ to }) => {
    io.to(to).emit("call-ended");
  });

});







      // Listen for chat opened
  socket.on("chatOpened", async ({ senderId, receiverId }) => {
    try {
       await Message.updateMany(
        { senderId, receiverId, seen: false },
        { $set: { seen: true } }
      );

      // Emit to sender that messages were seen
      io.to(senderId).emit("messagesSeen", {receiverId});
    } catch (err) {
      console.log(err);
    }
  });

    // Send message to private room
    socket.on("sendMessage", Sendmessage(io))
    // handle Group Messages
    socket.on("sendGroupMessage", SendGroupMessage(io));

    socket.on("disconnect",OffLine(socket));

// Typing indicators
    socket.on("typing", async (data) => {
   const { senderId, receiverId, groupId, isGroupChat, isTyping } = data;
    if (isGroupChat) {
      Group.findById(groupId).then((group) => {
        group.members.forEach((memberId) => {
          if (memberId.toString() !== senderId) {
            io.to(memberId.toString()).emit("typing", {
              groupId,
              senderId,
              isTyping,
              isGroupChat: true,
            });
          }
        });
      });
    } else {
      // Private chat typing
      io.to(receiverId).emit("typing", { senderId, isTyping, isGroupChat: false });
    }
   })
});



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});