import {
  Avatar,
  Image,
  AvatarBadge,
  Text,
  Flex,
  Stack,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";

const Conversation = () => {
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src="https://res.cloudinary.com/dmwlvhh7u/image/upload/v1730007803/wxpklwkkgb8osdjjjcv0.jpg"
        >
        <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"}>
          Ngọc Lành{" "}
          <Image src={"../../public/verified.png"} w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          Xin chào bạn đến với trang chat ...
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
