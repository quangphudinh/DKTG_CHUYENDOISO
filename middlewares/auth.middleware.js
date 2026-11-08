const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Lấy token từ header với định dạng "Bearer <token>"
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ Status: false, Res: "Truy cập bị từ chối. Không tìm thấy token." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Gắn thông tin giải mã được (taiKhoanId, cpnId, adminRole) vào req
    next(); // Cho phép đi tiếp vào controller
  } catch (error) {
    return res.status(400).json({ Status: false, Res: "Token không hợp lệ hoặc đã hết hạn." });
  }
};