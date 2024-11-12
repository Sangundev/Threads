import {
  Avatar,
  Image,
  AvatarBadge,
  Text,
  Flex,
  Stack,
  useColorModeValue,
  WrapItem,
  useColorMode,
  Box,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messageAtom";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation?.participants?.[0];
  const lastMessage = conversation?.lastMessage || {};  // Fallback in case of missing lastMessage
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const { colorMode } = useColorMode(); // Correct way to get colorMode

  const onlineBadgeColor = useColorModeValue("green.500", "green.300"); // Adjust online badge color based on color mode

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.200", "gray.700"),
        color: "white",
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          name: user.name,
          mock: conversation.mock,
        })
      }
      bg={selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.600" : "gray.800") : ""}
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user?.profilePic || "https://default-image-url.jpg"}
        >
          {isOnline && <AvatarBadge boxSize={"1em"} bg={onlineBadgeColor} />}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"} className="truncate">
          {user?.name || "Unknown User"}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>

        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id === lastMessage?.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : ""}
          {lastMessage?.text ? (
            lastMessage.text.length > 20 ? lastMessage.text.substring(0, 20) +
             "..." : lastMessage.text || "Hình ảnh"
          ) : (
            "No messages yet"
          )}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
