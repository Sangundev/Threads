import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
    try {
    const token = req.cookies.jwt;
    
    // Kiểm tra xem token có tồn tại hay không
    if (!token) {
        return res.status(401).json({ message: "Lỗi: Chưa có mã nào được lưu" });
    }
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("password");
        req.user = user;
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Lỗi: Mã không tồn tại." });
    }
};

export default protectRoute;
