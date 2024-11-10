import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { BsEmojiSmile, BsFillImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messageAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import EmojiPickerComponent from "../components/EmojiPicker";
import usePreviewImg from "../hooks/usePreviewing";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Only send if there's text or an image, and avoid sending if already in the process of sending
    if ((!messageText && !imgUrl) || isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imgUrl || null, // Send image URL if available, else send null
        }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      const newMessage = {
        _id: data._id || Date.now(),
        text: messageText,
        sender: data.sender || selectedConversation.userId,
        ownMessage: true,
        img: imgUrl || "", 
      };

      setMessages((messages) => [...messages, newMessage]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText || "",
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });

      // Clear inputs after sending
      setMessageText("");
      setImgUrl(""); // Clear the image URL after sending
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    if (emoji) {
      setMessageText((prevText) => prevText + emoji);
    } else {
      console.error("Selected emoji is undefined");
    }
    setShowEmojiPicker(false);
  };

  return (
    <Flex gap={2} alignItems={"center"} position="relative">
      {showEmojiPicker && (
        <div style={{ position: "absolute", bottom: "50px", left: "10px" }}>
          <EmojiPickerComponent onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <IconButton
        icon={<BsEmojiSmile />}
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        aria-label="Emoji Picker"
      />

      <form onSubmit={handleSendMessage} style={{ flex: 1 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Type a message"
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            {isSending ? <Spinner size="sm" /> : <IoSendSharp />}
          </InputRightElement>
        </InputGroup>
      </form>

      <Flex>
        <IconButton
          icon={<BsFillImageFill />}
          onClick={() => imageRef.current.click()}
          aria-label="Image Picker"
        />
        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>

      <Modal
        isOpen={!!imgUrl} // Open modal only if imgUrl exists
        onClose={() => {
          onClose();
          setImgUrl(""); // Clear imgUrl when modal closes
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"} justifyContent="center">
              {imgUrl && <Image src={imgUrl} alt="Selected image preview" />}
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IconButton
                  icon={<IoSendSharp />}
                  onClick={handleSendMessage}
                  aria-label="Send Message with Image"
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
