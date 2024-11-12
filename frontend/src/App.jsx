import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import userAtom from "./atoms/userAtom";
import { useRecoilValue } from "recoil";
// import LogoutButton from "./components/LogoutButton.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  // console.log(user);

  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w={"full"}>
      <Container
        maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
      >
        <Header />
        <Routes>
          {/* Redirect to auth if user is not logged in, otherwise render HomePage */}
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />

          {/* Render AuthPage if user is not logged in, otherwise redirect to HomePage */}
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />

          {/* Public routes accessible without authentication */}
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>

        {/* {user && <LogoutButton />} */}
      </Container>
    </Box>
  );
}

export default App;
