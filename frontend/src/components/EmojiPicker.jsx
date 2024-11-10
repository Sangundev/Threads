// EmojiPickerComponent.jsx
import EmojiPicker from "emoji-picker-react";

const EmojiPickerComponent = ({ onEmojiClick }) => {
  return (
    <EmojiPicker
      onEmojiClick={(emojiObject) => {
        // Kiểm tra xem emojiObject có chứa emoji không
        if (emojiObject && emojiObject.emoji) {
          onEmojiClick(emojiObject.emoji); // Truyền emoji đã chọn
        } else {
          console.error("Emoji object is undefined or invalid:", emojiObject);
        }
      }}
    />
  );
};

export default EmojiPickerComponent;
