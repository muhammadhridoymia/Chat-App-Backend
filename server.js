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

    // Send message to private room
    socket.on("sendMessage", Sendmessage(io))
    // handle Group Messages
    socket.on("sendGroupMessage", SendGroupMessage(io));

    socket.on("disconnect",OffLine(socket));
});



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
