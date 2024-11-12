import { Button, Text } from '@chakra-ui/react';
import useShowToast from '../hooks/useShowToast';
import useLogout from '../hooks/useLogout';

const SettingsPage = () => {
    const showToast = useShowToast();
    const logout = useLogout();

    const freezeAccount = async () => {
        const confirmed = window.confirm("Are you sure you want to freeze your account?");
        if (!confirmed) return; // Exit if user cancels the confirmation

        try {
            const res = await fetch("/api/users/freeze", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            if (data.error) {
                showToast("Err", data.error, "err");
            } else if (data.success) {
                await logout(); // Log the user out after freezing the account
                showToast("Ok", data.success, "ok");
            }
        } catch (error) {
            showToast("Error", error.message, false);
        }
    };

    return (
        <>
            <Text my={1} fontWeight={"bold"}>
                Tạm ngừng tài khoản 
            </Text>
            <Text my={1}>
                Bạn có muốn đăng nhập lại tài khoản khác không?
            </Text>
            <Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
                Tạm ngừng
            </Button>
        </>
    );
}

export default SettingsPage;
