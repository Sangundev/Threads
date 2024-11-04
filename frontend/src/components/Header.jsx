import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/AuthAtom";
import { BsFillChatQuoteFill} from "react-icons/bs"


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Lấy trạng thái màu và hàm chuyển đổi màu
  const user = useRecoilValue(userAtom); // Lấy thông tin người dùng từ trạng thái toàn cục
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} /> {/* Biểu tượng trang chủ */}
        </Link>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={
          () => setAuthScreen('login')
        }>
          Login
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
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} /> 
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20} /> 
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={"20px"} /> {/* Removed extra 'zz' */}
          </Button>
        </Flex>
      )}
      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={
          () => setAuthScreen('singup')
        }>
         Sign up
        </Link>
      )}
    </Flex>
  );
};

export default Header;
