import { Button, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom"


const HomePage = () => {
  return (
    <Link to={"/Sang"}>
    <Flex w={"full"} justifyContent={"center"}>
        <Button mx={"auto"}>Trang chủ</Button>
    </Flex>
    </Link>
  )
}

export default HomePage