import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lastMessage: {
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seen: {
			type: Boolean,
			default: false,
		},
  },
}, {
  timestamps: true,  
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
