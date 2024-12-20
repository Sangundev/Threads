import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";


const Comment = ({ reply ,lastReply}) => {

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} align={"center"}>
            <Text fontSize="sm" fontWeight="bold">
              {reply.name}
            </Text>
            
          </Flex>
          <Text>{reply.text}</Text>
          
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
