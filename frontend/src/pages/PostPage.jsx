import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/public/ngocsang.jpg" size={"md"} name="Ngọc Sang" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Ngọc Sang
            </Text>
            <Image src="/public/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>miss you !!</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px soid"}
        borderColor={"gray.light"}
      >
        <Image
          src="https://images.hdqwalls.com/wallpapers/bthumb/anime-girl-moescape-alone-standing-4k-nz.jpg"
          w={"full"}
        />
      </Box>
      <Flex>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={3} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"} fontSize={"sm"}>
            😊
          </Text>
          <Text color={"gray.light"}> hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh </Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={3} />

      <Comment
        comment="How are you today ? :))"
        createAt="1h"
        likes={2000}
        username="Ngọc Lành"
        useravatar="/public/ngoclanh.jpg"
      />
      <Comment
        comment="Can you chat to me ? :))"
        createAt="59p"
        likes={20000}
        username="Ngọc Lành"
        useravatar="/public/ngoclanh.jpg"
      />
    </>
  );
};

export default PostPage;
