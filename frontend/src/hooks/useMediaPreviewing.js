import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewMedia = () => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const showToast = useShowToast();

  // const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB limit

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size
      // if (file.size > MAX_FILE_SIZE) {
      //   showToast("File too large", "Please select a file smaller than 50 MB", "error");
      //   setMediaUrl(null);
      //   setMediaType(null);
      //   return;
      // }

      // Check file type
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaUrl(reader.result);
          setMediaType("image");
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        setMediaUrl(videoUrl);
        setMediaType("video");

        // Cleanup URL to avoid memory leaks
        return () => URL.revokeObjectURL(videoUrl);
      } else {
        showToast("Invalid file type", "Please select an image or video file", "error");
        setMediaUrl(null);
        setMediaType(null);
      }
    }
  };

  return { handleMediaChange, mediaUrl, mediaType, setMediaUrl };
};


export default usePreviewMedia;