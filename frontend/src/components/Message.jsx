import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messageAtom";
import userAtom from "../atoms/userAtom";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom); // Access current user data

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf="flex-end" justifyContent="flex-end">
          {/* <Text maxW="350px" bg="blue.400" p={2} borderRadius="md" color="white">
            {message.text}
          </Text> */}
          <Text
            maxW="350px"
            backgroundImage="url('/public/Group 725.png')"
            backgroundSize="cover"
            p={2}
            borderRadius="md"
            color="black"
          >
            {message.text}
          </Text>

          <Avatar src={user.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2} alignSelf="flex-start" justifyContent="flex-start">
          <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
          <Text
            maxW="350px"
            bg="gray.400"
            p={2}
            borderRadius="md"
            color="black"
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
