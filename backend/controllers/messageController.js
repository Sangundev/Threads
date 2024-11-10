import Conversation from "../models/conversationModel.js"; // Import your Conversation model
import Message from "../models/messageModel.js"; // Import your Message model if needed
import { getRecentSocketId, io } from "../socket/socket.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
const upload = multer(); // Initialize multer for handling multipart/form-data
// Gửi tin nhắn
async function sendMessage(req, res) {
	try {
		const { recipientId, message } = req.body;
		let { img } = req.body;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId] },
		});

		if (!conversation) {
			conversation = new Conversation({
				participants: [senderId, recipientId],
				lastMessage: {
					text: message,
					sender: senderId,
				},
			});
			await conversation.save();
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newMessage = new Message({
			conversationId: conversation._id,
			sender: senderId,
			text: message,
			img: img || "",
		});

		await Promise.all([
			newMessage.save(),
			conversation.updateOne({
				lastMessage: {
					text: message,
					sender: senderId,
				},
			}),
		]);

    const recipientSocketId = getRecentSocketId(recipientId);

    // Emit the message to the recipient if they're online
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    } else {
      // Log if the user is offline
      console.log(`Recipient ${recipientId} is offline, message not sent in real-time.`);
    }
		res.status(201).json(newMessage);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}


// hiện tin nhắn
async function getMessage(req, res) {
  const { ortherUserId } = req.params;
  const userId = req.user._id;

  try {
    // Tìm cuộc trò chuyện giữa người dùng hiện tại và người dùng khác
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, ortherUserId] },
    });

    // Nếu không tìm thấy cuộc trò chuyện, trả về lỗi 404
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Lấy tất cả tin nhắn trong cuộc trò chuyện này và sắp xếp theo thời gian
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// hiện cuộc hội thoại
// Hiển thị các cuộc hội thoại
async function getConversation(req, res) {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "name username profilePic",
    });

    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage, getMessage, getConversation };
