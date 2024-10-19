import {
  Avatar,
  Box,
  Flex,
  VStack,
  Text,
  MenuButton,
  Menu,
  Portal,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link } from "react-router-dom";

const UserHeader = () => {
  const toast = useToast();

  const CopyURL = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      const examplePromise = new Promise((resolve) => {
        setTimeout(() => resolve(0), 600);
      });

      toast.promise(examplePromise, {
        success: {
          title: "Thành Công",
          description: "copy link thành công",
          status: "success",
        },
        error: {
          title: "Thất Bại",
          description: "copy link thất bại",
          status: "error",
        },
        loading: {
          title: "Vui lòng đợi trong giây lát",
          description: "mã đang được copy",
          status: "loading",
        },
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            John Doe
          </Text>
          <Flex gap={2} alignItems={"start"}>
            <Text fontSize={"sm"}>shhhhhhhhhhh</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              Thraeds.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar name="Sang" src="" size={
            {
                base: "sm",
                md: "xl",
            }
          } />
        </Box>
      </Flex>

      <Text>I LOVE HER SO MUCH BUT SHE DOESNT LOVE ME BACK</Text>

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>3.2k followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>intagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={CopyURL}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Thraeds</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
