
import Conversation from "../models/conversationModel.js";  // Import your Conversation model
import Message from "../models/messageModel.js";  // Import your Message model if needed


// Gửi tin nhắn
async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;

    // Find an existing conversation between sender and recipient
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    } else {
      // Update the last message in the existing conversation
      conversation.lastMessage = {
        text: message,
        sender: senderId,
      };
      await conversation.save();
    }

    // Create and save the new message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
        newMessage.save(),
        conversation.updateOne({
            lastMessage:{
                text: message,
                sender: senderId,
            }
        })
    ])
    res.status(201).json({ message: "Message sent successfully", newMessage });
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
            participants: { $all: [userId, ortherUserId] }
        });

        // Nếu không tìm thấy cuộc trò chuyện, trả về lỗi 404
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Lấy tất cả tin nhắn trong cuộc trò chuyện này và sắp xếp theo thời gian
        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// hiện cuộc hội thoại
async function getConversation(req, res) {
    const userId = req.user._id;
    try {
        const conversations = await Conversation.find({participants: userId}).populate({
            path: "participants",
            select: "username profilePic",
        })

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export { sendMessage, getMessage, getConversation};
