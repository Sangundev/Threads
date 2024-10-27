import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import { Link as RouterLink } from "react-router-dom";


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Lấy trạng thái màu và hàm chuyển đổi màu
  const user = useRecoilValue(userAtom); // Lấy thông tin người dùng từ trạng thái toàn cục

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} /> {/* Biểu tượng trang chủ */}
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={
          colorMode === "dark"
            ? "/public/light-logo.svg" // Logo cho chế độ tối
            : "/public/dark-logo.svg" // Logo cho chế độ sáng
        }
        onClick={toggleColorMode} // Chuyển đổi giữa các chế độ màu khi nhấp
      />
      {user && (
        <Link as={RouterLink} to={`/${user.username}`}>
          <RxAvatar size={24} /> {/* Biểu tượng trang cá nhân */}
        </Link>
      )}
    </Flex>
  );
};

export default Header;
