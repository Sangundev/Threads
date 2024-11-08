import { atom } from "recoil";

// Conversations Atom
export const conversationsAtom = atom({
  key: "conversationsAtom",  // Ensure this key is unique across the app
  default: [],  // Default value is an empty array (assuming this will store a list of conversations)
});

// Selected Conversation Atom
export const selectedConversationAtom = atom({
  key: "selectedConversationAtom",  // Ensure this key is unique across the app
  default: {
    _id: "",  // Initialize with an empty string for _id
    userId: "",  // Initialize with an empty string for userId
    username: "",  // Initialize with an empty string for username
    userProfilePic: "",  // Initialize with an empty string for userProfilePic (consider adding a default image if necessary)
  },
});
