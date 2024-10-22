import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // Tạo token với userId
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d", // Token sẽ hết hạn sau 15 ngày
  });

  // Thiết lập cookie với token
  res.cookie("jwt", token, {
    httpOnly: true, // Ngăn chặn truy cập vào cookie từ JavaScript
    secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS trong môi trường sản xuất
    maxAge: 15 * 24 * 60 * 60 * 1000, // Thời gian sống của cookie (15 ngày tính bằng mili giây)
    sameSite: "Strict", // Ngăn chặn CSRF
  });

  return token;
};

export default generateTokenAndSetCookie;
