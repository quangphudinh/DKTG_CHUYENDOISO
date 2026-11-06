const mongoose = require('mongoose');

// Schema Đăng ký thăm gặp
const ThamGapSchema = new mongoose.Schema({
  thamGapId: { type: String, required: true, unique: true },
  thongTinCPN: {
    cpnId: String,
    hoTen: String,
    cccd: String
  },
  thongTinThanNhan: {
    thanNhanId: String,
    hoTen: String,
    quanHe: String,
    sdt: String
  },
  ngayDangKyThamGap: { type: Date, required: true },
  trangThai: {
    type: String,
    enum: ['Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Hoàn thành'],
    default: 'Chờ duyệt'
  }
});

module.exports = mongoose.model('ThamGap', ThamGapSchema);