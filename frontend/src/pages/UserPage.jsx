import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"; // Component hiển thị thông tin người dùng
import UserPost from "../components/UserPost"; // Component hiển thị bài viết của người dùng
import { useParams } from "react-router-dom"; // Để lấy tham số từ URL
import useShowToast from "../hooks/useShowToast"; // Custom hook hiển thị thông báo
import { Flex, Spinner } from "@chakra-ui/react"; // Các component từ Chakra UI

const UserPage = () => {
  const [user, setUser] = useState(null); // State để lưu thông tin người dùng
  const { username } = useParams(); // Lấy username từ URL
  const showToast = useShowToast(); // Khởi tạo hook hiển thị thông báo
  const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái tải dữ liệu

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`); // Gửi yêu cầu đến API để lấy thông tin người dùng
        
        // Kiểm tra phản hồi có thành công hay không
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json(); // Phân tích JSON từ phản hồi
        setUser(data); // Cập nhật state người dùng

        if (data.error) {
          showToast("Error", data.error, "error"); // Hiển thị thông báo lỗi nếu có
          return;
        } else {
          setUser(data); // Nếu không có lỗi, cập nhật state người dùng
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("Error", "Failed to fetch user data. Please try again later.", "error"); // Hiển thị thông báo lỗi
      } finally {
        setLoading(false); // Đặt loading thành false sau khi hoàn tất
      }
    };

    getUser(); // Gọi hàm lấy thông tin người dùng
  }, [username, showToast]);

  // Kiểm tra trạng thái loading và thông tin người dùng
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} /> {/* Hiển thị spinner trong khi loading */}
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>; // Nếu không tìm thấy người dùng và không loading

  return (
    <>
      <UserHeader user={user} /> {/* Hiển thị thông tin người dùng */}
      <UserPost /> {/* Hiển thị bài viết của người dùng */}
      <UserPost
        likes={1200}
        replies={481}
        postImg="https://as2.ftcdn.net/v2/jpg/05/89/23/21/1000_F_589232168_qNBfxUughDMA6LzlXiIg2e0B3ntCmZbH.jpg"
        postTile="So the post not is good because her absence"
      />
      <UserPost /> {/* Có thể thêm các bài viết khác ở đây */}
      <UserPost />
      <UserPost />
    </>
  );
};

export default UserPage;
