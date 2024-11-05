import { Avatar, Divider, Image, Flex, useColorModeValue, Text, SkeletonCircle, Skeleton } from '@chakra-ui/react';
import Message from './Message';
import MessageInput from './MessageInput';

const MessageContainer = () => {


  
  return (
    <Flex 
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius="md"
      p={2}
      flexDirection="column"
    >
      <Flex w="full" h={12} alignItems="center" gap={2}>
        <Avatar 
          src="https://res.cloudinary.com/dmwlvhh7u/image/upload/v1730007803/wxpklwkkgb8osdjjjcv0.jpg" 
          size="sm" 
        />
        <Text display="flex" alignItems="center">
          Ngọc Lành 
          <Image src="/verified.png" w={4} h={4} ml={1} alt="Verified Badge"/>
        </Text>
      </Flex>
      
      <Divider />

      <Flex p={2} flexDir="column" gap={4} my={4} height="400px" overflow="auto">
        {
          false && [...Array(5)].map((_, i) => (
            <Flex 
              key={i} 
              gap={2} 
              alignItems="center" 
              p={1} 
              borderRadius="md"
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir="column" gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))
        }

        <Message ownMessage={true}/>
        <Message ownMessage={true}/>
        <Message ownMessage={false}/>
        <Message ownMessage={true}/>

      </Flex>
      <MessageInput />
    </Flex>
  );
};

export default MessageContainer;
