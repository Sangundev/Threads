import { Avatar, Box, Flex, Text, Image } from "@chakra-ui/react";
// import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.message, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();

    
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if(!window.confirm("Are you sure you want to delete") ) return;

      const res = await fetch(`/api/posts/${post._id}`,{
        method: 'DELETE',
      });

      const data = await res.json();
      if(data.error){
        showToast("Error", data.message, "error");
      }
      showToast("Delete post successfully deleted", data.message, "success");
      setPosts((prev) => prev.filter((p) => p._id !== post._id));

    } catch (error) {
      showToast("Error", error.message, "error");
    }
  }

  if (!user) return null;



  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user?.name}
            src={user?.profilePic}
            onClick={(event) => {
              event.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.200"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>😮</Text>}

            {post.replies
              .filter(
                (reply, index, self) =>
                  index === self.findIndex((r) => r.userId === reply.userId) // Filter unique user IDs
              )
              .slice(0, 3) // Get only the first 3 unique replies
              .map((reply, index) => (
                <Avatar
                  key={reply.userId} // Use userId as key if unique, else combine with index
                  size={"xs"}
                  name={reply.username || "Reply User"}
                  src={reply.userProfilePic}
                  position={"absolute"}
                  top={index === 0 ? "0px" : "auto"}
                  left={index === 0 ? "15px" : index === 2 ? "4px" : "auto"}
                  bottom={index === 1 || index === 2 ? "0px" : "auto"}
                  right={index === 1 ? "-5px" : "auto"}
                  padding={"2px"}
                />
              ))}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"ms"}
                fontWeight={"bold"}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.name}
              </Text>
              <Image src="/public/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"} textAlign={"right"}>
              <Text fontSize={"xs"} width={36} color={"gray.500"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

                {currentUser?._id == user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.200"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
