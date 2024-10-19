import { Avatar, Flex, Text, Image, Box, Divider, Button } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreads } from "react-icons/bs";
import Actions from "../components/Actions";

const PostPage = () => {
    const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src="https://as2.ftcdn.net/v2/jpg/05/89/23/21/1000_F_589232168_qNBfxUughDMA6LzlXiIg2e0B3ntCmZbH.jpg"
            size={"md"}
            name=""
            Ngoc
            Sang
          />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Username
            </Text>
            <Image src="/public/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreads />
        </Flex>
      </Flex>

      <Text my={3}>hhhhhhhhhhh</Text>

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
            {200+(liked ? 1:0)} likes
        </Text>
    </Flex>
    <Divider  my={3} />

    <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>😊</Text>
            <Text color={"gray.light"} > hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh </Text>
        </Flex>
        <Button>Get</Button>
    </Flex>
    <Divider  my={3} />


    </>
  );
};

export default PostPage;
