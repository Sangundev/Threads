import express from "express";
import { signupUser, loginUser, logoutUser, follownnfollowUser, updateUser} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
//SignUp
router.post("/signup", signupUser);
// Login
router.post("/login",loginUser);
//Logout
router.post("/logout",logoutUser);
//follower/unfollower
router.post("/follow/:id", protectRoute ,follownnfollowUser);
// update User 
router.post("/update/:id", protectRoute ,updateUser);

export default router;
