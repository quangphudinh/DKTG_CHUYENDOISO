const mongoose = require('mongoose');

// Schema Tài Khoản
const TaiKhoanSchema = new mongoose.Schema({
  taiKhoanId: { type: String, required: true, unique: true },
  cccd: { type: String, required: true, unique: true },
  matKhau: { type: String, required: true },
  ngayTao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaiKhoan', TaiKhoanSchema);