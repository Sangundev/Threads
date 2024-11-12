import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"; // Component to display user info
// import UserPost from "../components/UserPost"; // Component to display user posts
import { useParams } from "react-router-dom"; // To get parameters from URL
import useShowToast from "../hooks/useShowToast"; // Custom hook for showing toast notifications
import { Flex, Spinner } from "@chakra-ui/react"; // Chakra UI components
import Post from "../components/Post"; // Component to display
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams(); // Get username from URL
  const showToast = useShowToast(); // Initialize toast hook
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isFetchingPosts, setIsFetchingPosts] = useState(true); // State for post fetching status

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setIsFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);

        // Check if response is successful
        if (!res.ok) {
          throw new Error(
            `Failed to fetch posts: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        console.log(data);
        setPosts(data); // Set fetched posts
      } catch (error) {
        showToast("Failed to fetch posts", error.message, "error");
      } finally {
        setIsFetchingPosts(false); // Set post fetching status to false after completion
      }
    };

    getPosts(); // Call function to fetch posts
  }, [username, showToast, setPosts, user]);
  console.log("posts is here anh it is recoil state", posts);
  // Check loading status and user info
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} /> {/* Show spinner while loading */}
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>; // Show message if user not found

  return (
    <>
      <UserHeader user={user} /> {/* Display user info */}
      {!isFetchingPosts && posts.length === 0 && (
        <h1>Chưa có bài viết nào để hiển thị</h1>
      )}
      {isFetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
