import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil"; 
import userAtom from "../atoms/userAtom"; // Import your user atom
import { useNavigate } from "react-router-dom"; // For navigation
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom); // Correctly get setUser
  const showToast = useShowToast();
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Clear user data
        setUser(null); // Reset the user atom
        localStorage.removeItem("user-threads"); // Clear user data from local storage
        
        // Show success toast notification
        showToast("Logout Successful", "You have been logged out.", "success");
        
        // Redirect to login or home page
        navigate("/auth"); // Change this to your desired route after logout
      } else {
        const data = await res.json(); // Parse the response for error details
        showToast("Logout Failed", data.error || "An error occurred.", "error");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Logout Error", "An unexpected error occurred.", "error");
    }
  };

  return (
    <Button 
      position={"fixed"} 
      top={"30px"} 
      right={"30px"} 
      size={"sm"} 
      onClick={handleLogout}
    >
      <FiLogOut size={"20px"}/> {/* Removed extra 'zz' */}
    </Button>
  );
};

export default LogoutButton;
