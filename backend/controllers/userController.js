import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Post from "../models/postModel.js";
import generateTokenAndSetCookie from "../utils/helpers/gennerateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
//Xem trang cá nhân
const getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query }).select("-password -updatedAt");
    } else {
      user = await User.findOne({ username: query }).select(
        "-password -updatedAt"
      );
    }

    if (!user) {
      return res.status(400).json({ message: "Người này không tồn tại" });
    }

    // Check if the current user follows the fetched profile
    const isFollowing = req.user
      ? user.followers.includes(req.user._id)
      : false;
    // console.log(isFollowing);
    res.json({
      ...user.toObject(),
      isFollowing, // Return following status
      followersCount: user.followers.length, // Total followers
      followingCount: user.following.length, // Total following
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

//SignUp
const signupUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Kiểm tra xem tất cả các trường có được cung cấp không
    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Tất cả các trường đều là bắt buộc." });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại." });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Sử dụng 10 vòng muối
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Tạo token và thiết lập cookie
    generateTokenAndSetCookie(newUser._id, res); // Sử dụng newUser._id thay vì user._id
    res.status(201).json({
      message: "Người dùng đã đăng ký thành công",
      user: {
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

//Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng" });
    }

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(error); // In ra lỗi trong console
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

//Logout
const logoutUser = async (req, res) => {
  try {
    // Xóa cookie bằng cách đặt giá trị thành rỗng và thời gian sống (maxAge) thành 0
    res.cookie("jwt", "", { maxAge: 1 }); // Thay vì res.cookies, nên sử dụng res.cookie

    // Gửi phản hồi thành công
    res.status(200).json({ message: "Thoát thành công" });
  } catch (error) {
    console.error(error); // In ra lỗi trong console
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
//Theo dõi / hủy theo dõi
const follownnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id); // Kiểm tra req.user._id

    if (!currentUser) {
      return res.status(401).json({ message: "Người dùng không tồn tại." });
    }

    if (id === currentUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không thể theo dõi / hủy theo dõi chính mình." });
    }

    if (!userToModify) {
      return res.status(400).json({ message: "Người này không tồn tại." });
    }

    const isFollowing = currentUser.following.includes(id);

    if (!isFollowing) {
      currentUser.following.push(id);
      userToModify.followers.push(currentUser._id);
    } else {
      currentUser.following = currentUser.following.filter(
        (followerId) => followerId.toString() !== id
      );
      userToModify.followers = userToModify.followers.filter(
        (followerId) => followerId.toString() !== currentUser._id.toString()
      );
    }

    await currentUser.save();
    await userToModify.save();

    res.status(200).json({
      message: isFollowing
        ? "Đã hủy theo dõi thành công."
        : "Đã theo dõi thành công.",
      following: !isFollowing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
// Cập nhật thông tin
// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ error: "Người dùng không tồn tại" });

    // Kiểm tra nếu người dùng muốn cập nhật tài khoản của người khác
    if (req.params.id !== userId.toString())
      return res
        .status(403)
        .json({ error: "Không thể cập nhật tài khoản của người khác" });

    // Cập nhật mật khẩu nếu có
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword; // Cập nhật mật khẩu đã được mã hóa
    }

    // Cập nhật ảnh đại diện nếu có
    if (profilePic) {
      // Nếu có ảnh cũ, xóa nó (bình luận lại để xử lý xóa nếu cần)
      // if (user.profilePic) {
      //   await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
      // }

      // Tải ảnh mới lên Cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
        quality: "auto:good", // Giảm chất lượng ảnh tự động
      });
      profilePic = uploadedResponse.secure_url; // Lấy URL của ảnh mới
    }

    // Cập nhật các thông tin khác của người dùng
    user.name = name || user.name; // Cập nhật tên nếu có
    user.email = email || user.email; // Cập nhật email nếu có
    user.username = username || user.username; // Cập nhật username nếu có
    user.profilePic = profilePic || user.profilePic; // Cập nhật ảnh đại diện nếu có
    user.bio = bio || user.bio; // Cập nhật bio nếu có

    await user.save(); // Lưu thông tin người dùng đã cập nhật

    // Cập nhật thông tin trong các bài viết mà người dùng đã bình luận
    await Post.updateMany(
      {
        "replies.userId": userId,
      },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
          "replies.$[reply].name": user.name,
        },
      },
      {
        arrayFilters: [{ "reply.userId": userId }], // Thêm arrayFilters để chỉ cập nhật các reply của user hiện tại
      }
    );

    // Xóa mật khẩu khỏi phản hồi
    user.password = null;

    // Gửi phản hồi thành công
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    res.status(500).json({ error: "Lỗi máy chủ", details: error.message });
  }
};

// const getsuggestedUsers = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Lấy danh sách người dùng mà bạn đang theo dõi
//     const usersFollowedByYou = await User.findById(userId).select("following");

//     // Truy vấn người dùng chưa được bạn theo dõi và chọn ngẫu nhiên 10 người
//     const users = await User.aggregate([
//       {
//         $match: {
//           _id: { $ne: userId }, // Loại trừ chính bạn khỏi kết quả
//         },
//       },
//       {
//         $sample: { size: 10 }, // Lấy 10 người dùng ngẫu nhiên
//       },
//     ]);

//     // Lọc ra những người chưa được bạn theo dõi
//     const filteredUsers = users.filter(
//       (user) => !usersFollowedByYou.following.includes(user._id.toString())
//     );

//     // Lấy 4 người dùng đầu tiên
//     const suggestedUsers = filteredUsers.slice(0, 4);

//     // Loại bỏ trường password khỏi mỗi người dùng
//     const cleanedUsers = suggestedUsers.map(user => {
//       const { password, ...userWithoutPassword } = user.toObject(); // Loại bỏ trường password
//       return userWithoutPassword;
//     });

//     res.status(200).json(cleanedUsers);
//   } catch (error) {
//     console.error("Error in getsuggestedUsers:", error.message);
//     res.status(500).json({ error: "Lỗi máy chủ", details: error.message });
//   }
// };
const getSuggestedUsers = async (req, res) => {
  try {
    // exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.isFrozen = true;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  follownnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
};
