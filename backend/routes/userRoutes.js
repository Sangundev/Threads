import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  follownnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
//xem trang cá nhân
router.get("/profile/:query", getUserProfile);
// xem trang cá nhân từ trag chính
router.get("/suggested", protectRoute, getSuggestedUsers);

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
router.put("/freeze", protectRoute, freezeAccount);

export default router;
