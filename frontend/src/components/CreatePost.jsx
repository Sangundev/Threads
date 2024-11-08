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
  const [postText, setPostText] = useState(""); // Initialize with an empty string
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR); // Initialize remaining character count
  // const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { handleMediaChange, mediaUrl, mediaType, setMediaUrl } = usePreviewMedia();
  const imageRef = useRef(null);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [ loading,setLoading] = useState();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const {username} = useParams();


  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
      showToast("Please enter as soon as text")
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handlePostSubmit = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            // body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
            body: JSON.stringify({ postedBy: user._id, text: postText, img: mediaUrl }),
          });
          const data = await res.json();
          if (data.error) {
            showToast("Error creating post", data.error, "error");
            return;
          }
          showToast("Post created successfully", data.success, "success");
          if(username == user.username) {

            setPosts([data, ...posts]);
          }
          onClose();
          setPostText("");
          // setImgUrl("");
          setMediaUrl("");
          console.log(data);
    } catch (error) {
        showToast("Error creating post", error, "error");
    }finally{
        setLoading(false);
    }
  };

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
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
                onChange={handleTextChange} // Use onChange to handle text input
                value={postText}
                maxLength={500} // Set maximum length for textarea
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={1}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                ref={imageRef}
                // onChange={handleImageChange}
                onChange={handleMediaChange}
                style={{ display: "none" }} // Hide the input element
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />


                {mediaUrl && (
                  mediaType === "image" ? (
                    <Flex mt={5} w={"full"} position={"relative"} justifyContent="center">
                      <Image 
                        src={mediaUrl} 
                        alt="selected image" 
                        objectFit="cover" 
                        w="100%" // Make image full width
                        h="auto" // Maintain aspect ratio
                      />
                      <CloseButton
                        onClick={() => setMediaUrl("")}
                        bg={"gray.800"}
                        position={"absolute"}
                        top={2}
                        right={2}
                      />
                    </Flex>
                  ) : (
                    <Flex mt={5} w={"full"} position={"relative"} justifyContent="center">
                      <video 
                        controls 
                        width="100%" // Make video full width
                        height="auto" // Maintain aspect ratio
                        style={{ maxWidth: "100%" }} // Ensure video scales correctly
                      >
                        <source src={mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <CloseButton
                        onClick={() => setMediaUrl("")}
                        bg={"gray.800"}
                        position={"absolute"}
                        top={2}
                        right={2}
                      />
                    </Flex>
                  )
                )}


              {/* {imgUrl && ( // Display image preview if available
                <Flex mt={5} w={"full"} position={"relative"}>
                  <Image src={imgUrl} alt="selected image" />
                  <CloseButton
                    onClick={() => {
                      setImgUrl("");
                    }}
                    bg={"gray.800"}
                    position={"absolute"}
                    top={2}
                    right={2}
                  />
                </Flex>
              )} */}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handlePostSubmit}
              isLoading={loading}
            >
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
