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
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messageAtom";

const Conversation = ({ conversation }) => {
  const user = conversation.participants?.[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setselectedConversation] = useRecoilState(selectedConversationAtom);
  const { colorMode } = useColorMode(); // Correct way to get colorMode

  console.log("selectedConversation", selectedConversation);

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
      onClick={() => setselectedConversation({
        _id: conversation._id,
        userId: user._id,
        userProfilePic: user.profilePic,
        name: user.name,
        mock: conversation.mock,
      })}
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
          <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"} className="truncate">
          {user?.name || "Unknown User"}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>

        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id === lastMessage.sender ? <BsCheck2All size={16}/> : ""}
          {lastMessage.text.length > 20 ? lastMessage.text.substring(0, 20) + "..." : lastMessage.text} {/* Fixed substring logic */}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
