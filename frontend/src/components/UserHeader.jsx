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
  Button,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil"; // Added import for useRecoilValue
import userAtom from "../atoms/userAtom"; // Adjust the path to your Recoil atom
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";


const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);


  const CopyURL = async() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.promise(
        new Promise((resolve) => setTimeout(() => resolve(0), 600)),
        {
          success: {
            title: "Thành Công",
            description: "Copy link thành công",
            status: "success",
          },
          error: {
            title: "Thất Bại",
            description: "Copy link thất bại",
            status: "error",
          },
          loading: {
            title: "Vui lòng đợi trong giây lát",
            description: "Mã đang được copy",
            status: "loading",
          },
        }
      );
    });
  };
  return (
    <VStack gap={4} alignItems="start">
      <Flex justifyContent="space-between" w="full">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {user.name}
          </Text>
          <Flex gap={2} alignItems="center">
            <Text fontSize="sm">{user.username}</Text>
            <Text
              fontSize="xs"
              bg="gray.dark"
              color="gray.light"
              p={1}
              borderRadius="full"
            >
              Thraeds.net
            </Text>
          </Flex>
        </Box>
        <Avatar
          name={user.name}
          src={user.profilePic || undefined}
          size={{ base: "sm", md: "xl" }}
        />
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size="sm">Update profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && <Button size="sm"
      onClick={handleFollowUnfollow} isLoading ={updating}>
        {following ? "unfollow" : "Follow"}
        </Button>}

      <Flex w="full" justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Text color="gray.light">{user.followers.length} followers</Text>
          <Box w={1} h={1} bg="gray.light" borderRadius="full" />
          <Link to="https://instagram.com" style={{ color: "gray.light" }}>
            instagram.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor="pointer" />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor="pointer" />
              </MenuButton>
              <Portal>
                <MenuList bg="gray.dark">
                  <MenuItem bg="gray.dark" onClick={CopyURL}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w="full">
        <Flex
          flex={1}
          borderBottom="1.5px solid white"
          justifyContent="center"
          pb={3}
          cursor="pointer"
        >
          <Text fontWeight="bold">Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom="1px solid gray"
          justifyContent="center"
          color="gray.light"
          pb={3}
          cursor="pointer"
        >
          <Text fontWeight="bold">Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
