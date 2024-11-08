import {
	Flex,
	Input,
	InputGroup,
	InputRightElement,
	Spinner,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { IoSendSharp } from "react-icons/io5";
  import useShowToast from "../hooks/useShowToast";
  import { conversationsAtom, selectedConversationAtom } from "../atoms/messageAtom";
  import { useRecoilValue, useSetRecoilState } from "recoil";
  
  const MessageInput = ({ setMessages }) => {
	const [messageText, setMessageText] = useState("");
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const [isSending, setIsSending] = useState(false);
  
	const handleSendMessage = async (e) => {
	  e.preventDefault();
	  if (!messageText || isSending) return;
  
	  setIsSending(true);
  
	  try {
		const res = await fetch("/api/messages", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			message: messageText,
			recipientId: selectedConversation.userId,
		  }),
		});
		const data = await res.json();
		if (data.error) {
		  showToast("Error", data.error, "error");
		  return;
		}
  
		// Ensure the new message has the correct properties
		const newMessage = {
		  _id: data._id || Date.now(),  // Use API id or fallback
		  text: messageText,             // Message text
		  sender: data.sender || selectedConversation.userId, // Set sender to ensure it's consistent
		  ownMessage: true,              // Explicitly set ownMessage to true
		};
  
		// Add the new message to the messages state immediately
		setMessages((messages) => [...messages, newMessage]);
  
		// Update the last message in the conversations list
		setConversations((prevConvs) => {
		  const updatedConversations = prevConvs.map((conversation) => {
			if (conversation._id === selectedConversation._id) {
			  return {
				...conversation,
				lastMessage: {
				  text: messageText,
				  sender: data.sender,
				},
			  };
			}
			return conversation;
		  });
		  return updatedConversations;
		});
  
		setMessageText(""); // Clear input field after sending
	  } catch (error) {
		showToast("Error", error.message, "error");
	  } finally {
		setIsSending(false);
	  }
	};
  
	return (
	  <Flex gap={2} alignItems={"center"}>
		<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
		  <InputGroup>
			<Input
			  w={"full"}
			  placeholder='Type a message'
			  onChange={(e) => setMessageText(e.target.value)}
			  value={messageText}
			/>
			<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
			  {isSending ? <Spinner size="sm" /> : <IoSendSharp />}
			</InputRightElement>
		  </InputGroup>
		</form>
	  </Flex>
	);
  };
  
  export default MessageInput;
  