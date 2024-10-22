import express from "express";
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
// taọ bài viết
router.post("/create", protectRoute, createPost);
// Xóa bài viết
router.delete("/:id", protectRoute, deletePost);
// Thích và bỏ thích bài viết
router.post("/like/:id", protectRoute, likeUnlikePost);
// Bình luận bài viết
router.post("/reply/:id", protectRoute, replyToPost);

export default router;
