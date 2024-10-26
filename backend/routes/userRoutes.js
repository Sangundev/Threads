import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  follownnfollowUser,
  updateUser,
  getUserProfile,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
//xem trang cá nhân
router.get("/profile/:username", getUserProfile);
//SignUp
router.post("/signup", signupUser);
// Login
router.post("/login", loginUser);
//Logout
router.post("/logout", logoutUser);
//follower/unfollower
router.post("/follow/:id", protectRoute, follownnfollowUser);
// update User
router.put("/update/:id", protectRoute, updateUser);

export default router;
