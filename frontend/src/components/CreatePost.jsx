import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Text,
  Input,
  Image,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
// import usePreviewImg from "../hooks/usePreviewing"; // Assuming this is your custom hook
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import usePreviewMedia from "../hooks/useMediaPreviewing";

const MAX_CHAR = 500;
const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const { handleMediaChange, mediaUrl, mediaType, setMediaUrl } = usePreviewMedia();
  const imageRef = useRef(null);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
      showToast("Please enter as soon as text");
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

const handlePostSubmit = async () => {
  setLoading(true);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // Timeout after 60 seconds

  try {
    const formData = new FormData();
    formData.append("postedBy", user._id);
    formData.append("text", postText);
    formData.append("mediaType", mediaType);
    formData.append("file", imageRef.current.files[0]);

    const res = await fetch("/api/posts/create", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    const data = await res.json();
    if (data.error) {
      showToast("Error creating post", data.error, "error");
      return;
    }
    showToast("Post created successfully", data.success, "success");
    if (username === user.username) {
      setPosts([data, ...posts]);
    }
    onClose();
    setPostText("");
    setMediaUrl("");
  } catch (error) {
    showToast("Error creating post", error.message, "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Button position="fixed" bottom={10} right={5} bg={useColorModeValue("gray.300", "gray.dark")} onClick={onOpen} size={{ base: "sm", sm: "md" }}>
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm bài viết</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="What's on your mind?"
                onChange={handleTextChange}
                value={postText}
                maxLength={500}
              />
              <Text fontSize="xs" fontWeight="bold" textAlign="right" m={1} color="gray.800">
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                ref={imageRef}
                onChange={handleMediaChange}
                style={{ display: "none" }}
              />
              <BsFillImageFill style={{ marginLeft: "5px", cursor: "pointer" }} size={16} onClick={() => imageRef.current.click()} />

              {mediaUrl && (
                mediaType === "image" ? (
                  <Flex mt={5} w="full" position="relative" justifyContent="center">
                    <Image src={mediaUrl} alt="selected image" objectFit="cover" w="100%" h="auto" />
                    <CloseButton onClick={() => setMediaUrl("")} bg="gray.800" position="absolute" top={2} right={2} />
                  </Flex>
                ) : (
                  <Flex mt={5} w="full" position="relative" justifyContent="center">
                    <video controls width="100%" height="auto" style={{ maxWidth: "100%" }}>
                      <source src={mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <CloseButton onClick={() => setMediaUrl("")} bg="gray.800" position="absolute" top={2} right={2} />
                  </Flex>
                )
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePostSubmit} isLoading={loading}>
              Submit
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

