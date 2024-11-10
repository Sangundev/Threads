import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  useColorModeValue,
  SkeletonCircle,
  Skeleton,
} from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";

import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messageAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const showToast = useShowToast();
  const [loadingconversations, setLoadingconversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setselectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [seachText, setSeachText] = useState("");
  const [seachingUser, setSeachingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const {socket,onlineUser} = useSocket();

  useEffect(() => {
    socket?.on("messageSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true, // Mark the last message as seen
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  
    // Cleanup the socket listener when component unmounts or socket changes
    return () => {
      socket?.off("messageSeen");
    };
  }, [socket, setConversations]);
  

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingconversations(false);
      }
    };
   
    getConversations();
  }, [showToast, setConversations]);


  const handleconversationSearch = async (e) => {
  e.preventDefault();
  setSeachingUser(true);
  try {
    // Sanitize input (optional: depending on your use case)
    const trimmedSearchText = seachText.trim();
    if (!trimmedSearchText) {
      showToast("Err", "Please enter a valid username", "Err");
      return;
    }

    const res = await fetch(`/api/users/profile/${trimmedSearchText}`);

    if (!res.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const seachedUser = await res.json();

    if (seachedUser.error) {
      showToast("Err", seachedUser.error, "Err");
      return;
    }

    const messagingYourself = seachedUser._id === currentUser._id;
    if (messagingYourself) {
      showToast("Err", "You cannot message yourself", "Err");
      return;
    }

    // Check if the conversation already exists
    const conversationAlreadyExists = conversations.find(conversation =>
      conversation.participants.some(participant => participant._id === seachedUser._id)
    );

    if (conversationAlreadyExists) {
      setselectedConversation({
        _id: conversationAlreadyExists._id,
        userId: seachedUser._id,
        name: seachedUser.name,
        username: seachedUser.username,
        userProfilePic: seachedUser.profilePic,
      });
      return;
    }

    // Create mock conversation if none exists
    const mockConversation = {
      mock: true,
      lastMessage: {
        text: "",
        sender: "",
      },
      _id: Date.now(),
      participants: [
        {
          _id: seachedUser._id,
          username: seachedUser.username,
          name: seachedUser.name,
          profilePic: seachedUser.profilePic,
        }
      ]
    };

    setConversations((prevConvs) => [...prevConvs, mockConversation]);

  } catch (error) {
    showToast("Err", error.message || error, "Err");
  } finally {
    setSeachingUser(false);
  }
};

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      // p={-2}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversation
          </Text>
          <form onSubmit={handleconversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Tìm kiếm người dùng... "
                onChange={(e) => setSeachText(e.target.value)}
              />
              <Button size={"sm"} onClick={handleconversationSearch} isLoading={seachingUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingconversations &&
            [0, 1, 2, 3, 4, 5].map((_, i) => (
              <Flex key={i} alignItems="center" gap={4} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size="10" />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingconversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUser.includes(conversation.participants[0]._id)}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Chọn người để mở đoạn chat</Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
