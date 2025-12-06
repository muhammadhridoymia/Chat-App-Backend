import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import Message from "./models/Message.js";
import messageRoutes from "./routes/messageRoutes.js"

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
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/messages",messageRoutes)

app.get("/", (req, res) => {
    res.send("Chat backend is running.");
});

// --------------------
// Create HTTP server for socket.io
// --------------------
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a private room (use user ID as room name)
    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`${userId} joined their private room`);
    });

    // Send message to private room
    socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, message } = data;

        if (!senderId || !receiverId || !message || message.trim() === "") return;

        try {
            const newMessage = new Message({ senderId, receiverId, message });
            const saved = await newMessage.save();

            if (saved) {
                // Send to sender and receiver only
                io.to(senderId).to(receiverId).emit("receiveMessage", data);
            }
        } catch (err) {
            console.log("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
