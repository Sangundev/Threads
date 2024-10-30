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
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState(null);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", "Error fetching post", "error");
          return;
        }
        setPost(data);
        console.log(data);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };

    getPost();
  }, [pid, showToast]);

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

      const res = await fetch(`/api/posts/${post._id}`, {
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
  if (!post) return null;
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
            {formatDistanceToNow(new Date(post.createdAt))} ago
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

      <Text my={3}>{post.text}</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px soid"}
        borderColor={"gray.light"}
      >
        {post.img && <Image src={post.img} w={"full"} />}
      </Box>
      <Flex>
        <Actions post={post} />
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
        {post.replies.map(reply=>(

          <Comment
           key={reply._id} 
           reply = {reply}

           lastReply={reply._id === post.replies[post.replies.length - 1]._id}
          />
        ))}
    </>
  );
};

export default PostPage;
