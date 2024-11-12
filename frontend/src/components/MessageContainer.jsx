import {
  Avatar,
  Divider,
  Flex,
  Text,
  useColorModeValue,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messageAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../../public/Sound/message.mp3";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Listener for new messages
    const handleNewMessage = (message) => {
      // Check if the new message belongs to the selected conversation
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prevConversations) => {
        return prevConversations.map((conversation) => {
          if (conversation._id === selectedConversation?._id) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
      });
    };

    // Attach socket listener
    socket.on("newMessage", handleNewMessage);

    // Cleanup listener when component unmounts or socket changes
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messageSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    // Scroll to the bottom of the message container when new messages are added
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Update each message with ownMessage flag based on sender
        const updatedMessages = data.map((message) => ({
          ...message,
          ownMessage: currentUser._id === message.sender,
        }));
        setMessages(updatedMessages);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.name}
        </Text>
      </Flex>

      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={2}
        height={"400px"}
        overflowY={"auto"}
        ref={messageContainerRef} // Attach the ref to the message container
      >
        {loadingMessages
          ? // Display skeletons while loading
            [...Array(5)].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
              >
                <SkeletonCircle size={7} />
                <Skeleton h="8px" w="250px" />
              </Flex>
            ))
          : messages.map((message) => (
              <Flex direction={"column"} key={message._id}>
                <Message message={message} ownMessage={message.ownMessage} />
              </Flex>
            ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
