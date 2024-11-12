import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users/suggested");
        const data = await res.json();

        if (data.error) {
          showToast(data.error); // Show error toast if exists
          return;
        }
        console.log(data)
        setSuggestedUsers(data); // Update state with fetched users
      } catch (error) {
        showToast("Error: " + error.message); // Show error toast in case of failure
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers(); // Call the function inside useEffect
  }, [showToast]); // Empty dependency array to call the effect only once on mount

  return (
    <>
      <Text>Theo dõi người dùng</Text>
      <Flex direction={"column"} gap={4}>
        {/* If loading, show Skeleton loaders */}
        {loading ? (
          [0, 1, 2, 3, 4, 5].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
            >
              <Box>
                <SkeletonCircle size={10} />
              </Box>
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))
        ) : (
          // If not loading, map over suggested users and render the SuggestedUser component
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))
        )}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
