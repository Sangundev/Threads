import {
  Avatar,
  Image,
  AvatarBadge,
  Text,
  Flex,
  Stack,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {BsCheck2All} from "react-icons/bs"

const Conversation = ({ conversation }) => {
  const user = conversation.participants?.[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
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
         {lastMessage.text.length > 20 ? lastMessage.text.substring(0.18)+ "..." : lastMessage.text} </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
