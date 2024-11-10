import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js"; // Add .js extension
import Conversation from "../models/conversationModel.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
  },
});

export const getRecentSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

const userSocketMap = {};

// When a new socket (client) connects
io.on("connection", (socket) => {
  console.log("User connected ID:", socket.id); // Logs the socket ID of the client
  const userId = socket.handshake.query.userId;

  // Store the socket ID along with the user ID
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Emit the list of online users
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // Listen for the 'marMessagesAsSeen' event
  socket.on("marMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      // Update the messages as seen in the database
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne({_id: conversationId},{$set: {"lastMessage.seen": true}});
      
      // Emit the "messageSeen" event to the user with the updated conversationId
      if (userSocketMap[userId]) {
        io.to(userSocketMap[userId]).emit("messageSeen", { conversationId });
      } else {
        console.log("User is not connected:", userId);
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected ID:", socket.id);

    // Remove the socket from the userSocketMap
    for (let userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break; // Exit the loop once the user is found and removed
      }
    }

    // Emit the updated list of online users
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

// Exporting io, server, and app for use in other parts of your application
export { io, server, app };
