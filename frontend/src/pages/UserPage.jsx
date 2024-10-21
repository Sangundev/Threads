import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost />
      <UserPost
        likes={1200}
        replies={481}
        postImg="https://as2.ftcdn.net/v2/jpg/05/89/23/21/1000_F_589232168_qNBfxUughDMA6LzlXiIg2e0B3ntCmZbH.jpg"
        postTile="So the post not is good because her absence"
      />
      <UserPost />
      <UserPost />
      <UserPost />
    </>
  );
};

export default UserPage;
