
const mongoose = require('mongoose');

const TaiKhoanSchema = new mongoose.Schema({
  taiKhoanId: { type: String, required: true, unique: true },
  cccd: { type: String, required: true, unique: true }, // Số CCCD của CPN làm tài khoản
  matKhau: { type: String, required: true },
  cpnId: { type: String, required: true },
  adminRole: { type: Boolean, default: false },
  trangThaiHoatDong: { type: Boolean, default: true }, // true = được đăng nhập
  ngayTao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaiKhoan', TaiKhoanSchema);