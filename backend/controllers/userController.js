import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/gennerateTokenAndSetCookie.js";

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
      const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;
      if (!user || !isPasswordCorrect) {
        return res.status(400).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
      }
      generateTokenAndSetCookie(user._id, res);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
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
            return res.status(400).json({ message: "Bạn không thể theo dõi / hủy theo dõi chính mình." });
        }

        if (!userToModify) {
            return res.status(400).json({ message: "Người này không tồn tại." });
        }

        const isFollowing = currentUser.following.includes(id);

        if (!isFollowing) {
            currentUser.following.push(id);
            userToModify.followers.push(currentUser._id);
        } else {
            currentUser.following = currentUser.following.filter(followerId => followerId.toString() !== id);
            userToModify.followers = userToModify.followers.filter(followerId => followerId.toString() !== currentUser._id.toString());
        }

        await currentUser.save();
        await userToModify.save();

        res.status(200).json({
            message: isFollowing ? "Đã hủy theo dõi thành công." : "Đã theo dõi thành công.",
            following: !isFollowing,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};
// Thay đổi thông tin người dùng 
const updateUser = async (req, res) => {
    const { name, username, email, profilePic, bio } = req.body; // Lấy thông tin từ yêu cầu

    try {
        const userId = req.user._id; // Lấy ID người dùng từ middleware protectRoute
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }
        user.name = name || user.name; 
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save();

        res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công.",
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
};

export { signupUser, loginUser, logoutUser, follownnfollowUser,updateUser };
