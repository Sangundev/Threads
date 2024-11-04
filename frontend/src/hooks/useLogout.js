import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useLogout = () => {
    const [user, setUser] = useRecoilState(userAtom); // Sửa đổi để destructure state và setter
    const showToast = useShowToast();

    const logout = async () => {
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
                showToast("Logout Successful", "You have been logged out.", "success"); // Thông báo thành công
            } else {
                const data = await res.json(); // Parse the response for error details
                showToast("Logout Failed", data.error || "An error occurred.", "error");
            }
        } catch (error) {
            console.error("Logout error:", error);
            showToast("Logout Error", "An unexpected error occurred.", "error");
        }
    };

    return logout; // Trả về hàm logout
}

export default useLogout;
