import { Flex, Spinner } from "@chakra-ui/react"; // Nhập các component từ Chakra UI
import { useEffect, useState } from "react"; // Nhập các hook từ Reactimport { Link } from "react-router-dom"; // Nhập Link để điều hướng
import useShowToast from "../hooks/useShowToast"; // Hook để hiển thị thông báo
import Post from "../components/Post";

const HomePage = () => {
  const [posts, setPosts] = useState([]); // State để lưu danh sách bài viết
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
  const showToast = useShowToast(); // Khởi tạo hook hiển thị thông báo

  useEffect(() => {
    const fetchPosts = async () => { // Hàm bất đồng bộ để lấy bài viết
      setLoading(true); // Bắt đầu loading
      try {
        const res = await fetch("/api/posts/feed"); // Gửi yêu cầu đến API
        const data = await res.json(); // Phân tích phản hồi JSON
      
        if(data.error) {
          showToast(data.error, data.message,"error"); //
          return; //
        }
        console.log(data); // In dữ liệu ra console
        setPosts(data); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        showToast("Error: " + error + ", please try again"); // Hiển thị thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchPosts(); // Gọi hàm lấy bài viết
  }, [showToast]); // Chỉ gọi một lần khi component được mount

  return (
   <>
   {!loading && posts.length === 0 && <h1>Theo dõi bạn bè để xem bài viết</h1>}
  {loading && (
    <Flex justify={"center"}>
      <Spinner size={"xl"} />
    </Flex>
  )}
  {posts.map((post) => (
    <Post key={post._id} post={post} postedBy={post.postedBy} />
  ))}

   </>
  );
}

export default HomePage;
