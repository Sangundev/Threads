import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title, description, status = "info") => {
      // Default status is "info", but you can pass "success", "error", or "warning"
      toast({
        title,
        description,
        status,  // "info", "warning", "success", "error"
        duration: 3000,
        isClosable: true,
        position: "top", // Optional: Customize position
        variant: "solid", // Optional: Customize the toast variant
      });
    },
    [toast]
  );

  return showToast;
};

export default useShowToast;
