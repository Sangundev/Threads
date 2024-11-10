import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import router from "../routes/postRoutes.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
const upload = multer(); // Initialize multer for handling multipart/form-data

// Xem bài viết
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404 ).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Tạo bài viết

// const createPost = async (req, res) => {
//   try {
//     // Extract the data from the request body
//     const { postedBy, text, img } = req.body;

//     // Ensure that required fields are provided
//     // if (!postedBy || !text) {
//     //   return res.status(400).json({ message: "Vui lòng kiểm tra lại thiếu thông tin bắt buộc" });
//     // }

//     if (!postedBy) {
//       return res.status(400).json({ message: "Vui lòng kiểm tra lại thiếu thông tin bắt buộc" });
//     }

//     const user = await User.findById(postedBy);
//     if (!user) {
//       return res.status(404).json({ message: "Người dùng không tồn tại" });
//     }

//     // Assuming req.user._id is set from authentication middleware
//     if (user._id.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ message: "Bạn không có quyền tạo bài viết" });
//     }

//     const maxLength = 500;
//     if (text.length > maxLength) {
//       return res.status(400).json({ message: `Ghi chú quá dài, tối đa ${maxLength} ký tự` });
//     }

//     let imageUrl = null;
//     if (img) {
//       const uploadedResponse = await cloudinary.uploader.upload(img);
//       imageUrl = uploadedResponse.secure_url;
//     }

//     const newPost = new Post({
//       postedBy,
//       // text,
//       text: text || "",
//       img: imageUrl,
//     });

//     // Save the post to the database
//     const savedPost = await newPost.save();

//     // Log the saved post information to the console
//     console.log("Post created successfully:", savedPost);

//     // Send a successful response with the saved post data
//     res.status(201).json(savedPost);
//   } catch (message) {
//     console.message(message);
//     res.status(500).json({ message: "Lỗi máy chủ", details: message.message || message });
//   }
// };
// Tạo bài viết
const createPost = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: "Failed to upload file" });
      
      const { postedBy, text, mediaType } = req.body;
      const file = req.file;

      if (!postedBy) return res.status(400).json({ message: "Missing required information" });

      // Verify the user
      const user = await User.findById(postedBy);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized action" });
      }

      const maxLength = 500;
      if (text && text.length > maxLength) {
        return res.status(400).json({ message: `Text too long, maximum ${maxLength} characters allowed` });
      }

      let mediaUrl = null;
      if (file) {
        const uploadOptions = { resource_type: mediaType === "video" ? "video" : "image" };
        try {
          // Use a promise to handle the upload completion before proceeding
          mediaUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
              if (error) {
                console.error("Upload to Cloudinary failed:", error);
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            });
            uploadStream.end(file.buffer);
          });
        } catch (uploadError) {
          console.error("Cloudinary upload failed:", uploadError);
          return res.status(500).json({ message: "Failed to upload media to Cloudinary", error: uploadError.message });
        }
      }

      const newPost = new Post({
        postedBy,
        text: text || "",
        img: mediaUrl, // Ensure mediaUrl is set here
      });

      const savedPost = await newPost.save();
      console.log("Post created successfully:", savedPost);
      res.status(201).json(savedPost);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", details: error.message || error });
  }
};


// Xóa bài viết
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Bạn không có quyền xóa bài viết" });
    }

    if(post.img){
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: " Xóa bài viết thành công" });
  } catch (message) {
    console.message(message);
    res.status(500).json({ message: "Lỗi máy chủ", message: message.message });
  }
};
// Thích và bỏ thích bài viết
const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params; // Extract post ID from request parameters
    const userId = req.user._id; // Get user ID from the request object
    const post = await Post.findById(postId); // Find the post by ID

    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" }); // Handle non-existing post
    }

    const userLikedPost = post.likes.includes(userId); // Check if the user already liked the post
    if (userLikedPost) {
      // If user already liked, remove their like
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } }); // Corrected to 'likes'
      return res.status(200).json({ message: "Bỏ thích bài viết thành công" }); // Response for unliking
    } else {
      // If user hasn't liked yet, add their like
      post.likes.push(userId); // Add user ID to the likes array
      await post.save(); // Save the updated post
      return res.status(200).json({ message: "Thích bài viết thành công" }); // Response for liking
    }
  } catch (message) {
    console.message(message); // Log any messages
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ", message: message.message }); // Response for server messages
  }
};
// Bình luận bài viết
const replyToPost = async (req, res) => {
  try {
    const { id: postId } = req.params; // Lấy ID bài viết từ tham số
    const { text } = req.body; // Lấy nội dung phản hồi từ body
    const userId = req.user._id; // Lấy ID người dùng từ yêu cầu
    const username = req.user.username; // Lấy username từ yêu cầu

    // Kiểm tra xem phản hồi có được cung cấp hay không
    if (!text) {
      return res.status(400).json({ message: "Chưa nhập phản hồi" });
    }

    // Kiểm tra xem bài viết có tồn tại hay không
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    // Tìm người dùng dựa trên userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Tạo một đối tượng phản hồi
    const reply = {
      userId, // ID người dùng đang phản hồi
      name: user.name, // Lấy tên người dùng từ đối tượng user
      text, // Nội dung phản hồi
      userProfilePic: user.profilePic || "", // Ảnh đại diện của người dùng
      username, // Username của người dùng
    };

    // Thêm phản hồi vào mảng replies của bài viết
    post.replies.push(reply);
    await post.save(); // Lưu bài viết đã cập nhật

    // Gửi phản hồi thành công
    res.status(201).json(reply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};


const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getUserPost = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPost,
};
