import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewMedia = () => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null); // Added state to track media type
  const showToast = useShowToast();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        // Handle image files
        const reader = new FileReader();

        reader.onloadend = () => {
          setMediaUrl(reader.result);
          setMediaType("image");
        };

        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        // Handle video files
        const videoUrl = URL.createObjectURL(file);
        setMediaUrl(videoUrl);
        setMediaType("video");
      } else {
        // Invalid file type
        showToast("Invalid file type", "Please select an image or video file", "error");
        setMediaUrl(null);
        setMediaType(null);
      }
    }
  };

  return { handleMediaChange, mediaUrl, mediaType, setMediaUrl };
};

export default usePreviewMedia;