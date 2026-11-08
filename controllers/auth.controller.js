const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { TaiKhoan, CPN } = require('../models');

// [API] - ĐĂNG KÝ TÀI KHOẢN
exports.register = async (req, res) => {
  try {
    const { taiKhoanId, cccdCPN, hoTenCPN, cccdThanNhan, hoTenThanNhan, matKhau } = req.body;

    // 1. Kiểm tra CPN có tồn tại không
    const cpn = await CPN.findOne({ cccd: cccdCPN, hoTen: hoTenCPN });
    if (!cpn) {
      return res.json({ Status: false, Res: "Không có thông tin can phạm nhân này." });
    }

    // 2. Kiểm tra thông tin thân nhân có khớp hồ sơ không
    const validThanNhan = cpn.thanNhan.find(tn => tn.cccd === cccdThanNhan && tn.hoTen === hoTenThanNhan);
    if (!validThanNhan) {
      return res.json({ Status: false, Res: "Thông tin thân nhân cung cấp không khớp với hồ sơ của CPN." });
    }

    // 3. Kiểm tra CPN đã có tài khoản chưa
    if (cpn.taiKhoan === true) {
      return res.json({ Status: false, Res: "Can phạm nhân này đã được đăng ký tài khoản trước đó." });
    }

    // 4. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(matKhau, salt);

    // 5. Tạo mới Tài Khoản
    const newTaiKhoan = new TaiKhoan({
      taiKhoanId: taiKhoanId || `TK${Date.now()}`, // Tự generate ID nếu không truyền
      cccd: cccdThanNhan,
      matKhau: hashedPassword,
      cpnId: cpn.cpnId,
      adminRole: false,
      trangThaiHoatDong: true
    });

    await newTaiKhoan.save();

    // 6. Cập nhật trạng thái taiKhoan của CPN thành true
    cpn.taiKhoan = true;
    await cpn.save();

    return res.json({ Status: true, Res: "Đăng ký tài khoản thành công." });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { cccd, matKhau } = req.body;

    // 1. Kiểm tra tài khoản
    const taiKhoan = await TaiKhoan.findOne({ cccd });
    if (!taiKhoan) {
      return res.json({ Status: false, Res: "Tài khoản không tồn tại." });
    }

    // 2. Kiểm tra mật khẩu (so sánh mật khẩu nhập vào với mật khẩu đã mã hóa)
    console.log("TaiKhoan.matKhau : ", taiKhoan.matKhau);
    console.log("MatKhau : ", matKhau);
    const isMatch = await bcrypt.compare(matKhau, taiKhoan.matKhau);
    console.log("isMatch : ", isMatch);
    if (!isMatch) {
      return res.json({ Status: false, Res: "Mật khẩu không chính xác." });
    }

    // 3. Kiểm tra trạng thái hoạt động
    if (taiKhoan.trangThaiHoatDong === false) {
      return res.json({ Status: false, Res: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin." });
    }

    // 4. Ký tạo Token (JWT)
    const payload = {
      taiKhoanId: taiKhoan.taiKhoanId,
      cpnId: taiKhoan.cpnId,
      adminRole: taiKhoan.adminRole
    };

    // Token có hạn 1 ngày
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Trả về token và role để frontend lưu vào localStorage
    return res.json({
      Status: true,
      Res: {
        message: "Đăng nhập thành công.",
        token: token,
        adminRole: taiKhoan.adminRole,
        cpnId: taiKhoan.cpnId
      }
    });

  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - KHÓA TÀI KHOẢN (Set trạng thái hoạt động = false)
exports.lockAccount = async (req, res) => {
  try {
    const { taiKhoanId } = req.params;

    // Tìm và cập nhật trạng thái hoạt động thành false
    const updatedTaiKhoan = await TaiKhoan.findOneAndUpdate(
      { taiKhoanId: taiKhoanId },
      { $set: { trangThaiHoatDong: false } },
      { new: true }
    );

    if (!updatedTaiKhoan) {
      return res.status(404).json({ Status: false, Res: "Không tìm thấy tài khoản với ID này." });
    }

    return res.json({
      Status: true,
      Res: `Đã khóa tài khoản ${taiKhoanId} thành công.`
    });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - MỞ KHÓA TÀI KHOẢN (Set trạng thái hoạt động = true)
exports.unlockAccount = async (req, res) => {
  try {
    const { taiKhoanId } = req.params;

    const updatedTaiKhoan = await TaiKhoan.findOneAndUpdate(
      { taiKhoanId: taiKhoanId },
      { $set: { trangThaiHoatDong: true } },
      { new: true }
    );

    if (!updatedTaiKhoan) {
      return res.status(404).json({ Status: false, Res: "Không tìm thấy tài khoản với ID này." });
    }

    return res.json({
      Status: true,
      Res: `Đã mở khóa tài khoản ${taiKhoanId} thành công.`
    });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - LẤY THÔNG TIN CÁ NHÂN (GET /me)
exports.getMe = async (req, res) => {
  try {
    // req.user được lấy từ middleware verifyToken
    const taiKhoan = await TaiKhoan.findOne({ taiKhoanId: req.user.taiKhoanId }).select('-matKhau');
    if (!taiKhoan) return res.status(404).json({ Status: false, Res: "Không tìm thấy tài khoản." });

    return res.json({ Status: true, Res: taiKhoan });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - LẤY DANH SÁCH TÀI KHOẢN (Chỉ dành cho Admin)
exports.getDanhSachTaiKhoan = async (req, res) => {
  try {
    if (!req.user.adminRole) {
      return res.status(403).json({ Status: false, Res: "Bạn không có quyền thực hiện chức năng này." });
    }
    const danhSach = await TaiKhoan.find({ adminRole: { $ne: true } })
      .select("-matKhau")
      .sort({ ngayTao: -1 });

    return res.json({ Status: true, Res: danhSach });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - ĐỔI MẬT KHẨU
exports.doiMatKhau = async (req, res) => {
  try {
    const { matKhauCu, matKhauMoi } = req.body;
    const taiKhoan = await TaiKhoan.findOne({ taiKhoanId: req.user.taiKhoanId });

    const isMatch = await bcrypt.compare(matKhauCu, taiKhoan.matKhau);
    if (!isMatch) return res.json({ Status: false, Res: "Mật khẩu cũ không chính xác." });

    const salt = await bcrypt.genSalt(10);
    taiKhoan.matKhau = await bcrypt.hash(matKhauMoi, salt);
    await taiKhoan.save();

    return res.json({ Status: true, Res: "Đổi mật khẩu thành công." });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};