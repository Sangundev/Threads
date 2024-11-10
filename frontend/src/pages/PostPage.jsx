import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
// import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  // const [post, setPost] = useState(null);
  const showToast = useShowToast();
  const { pid } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentPost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", "Error fetching post", "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };

    getPost();
  }, [pid, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.message, "error");
      }
      showToast("Delete post successfully deleted", data.message, "success");

      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  if (!currentPost) return null;
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Ngọc Sang" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.name}
            </Text>
            <Image src="../../public/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"} textAlign={"right"}>
          <Text fontSize={"xs"} width={36} color={"gray.500"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>

          {currentUser?._id == user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"} // Fixing the typo from "soid" to "solid"
        borderColor={"gray.200"} // Changed "gray.light" to a more common gray.200, adjust as needed
      >
        {currentPost.img &&
          (currentPost.img.endsWith(".mp4") ? (
            <video controls width="100%">
              <source src={currentPost.img} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image src={currentPost.img} w={"full"} />
          ))}
      </Box>

      <Flex>
        <Actions post={currentPost} />
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
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
