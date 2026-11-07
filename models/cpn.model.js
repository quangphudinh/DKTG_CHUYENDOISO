const mongoose = require('mongoose');

// Schema Thân nhân (Sub-document trong CPN)
const ThanNhanSchema = new mongoose.Schema({
  thanNhanId: { type: String, required: true },
  hoTen: { type: String, required: true },
  cccd: { type: String, required: true },
  quanHe: { type: String, required: true },
  noiThuongTru: { type: String, required: true },
  sdt: { type: String },
  email: { type: String }
});

// Schema Can Phạm Nhân (CPN)
const CPNSchema = new mongoose.Schema({
  cpnId: { type: String, required: true, unique: true },
  hoTen: { type: String, required: true },
  ngaySinh: { type: Date, required: true },
  cccd: { type: String, required: true, unique: true },
  noiThuongTru: { type: String, required: true },
  ngayBat: { type: Date, required: true },
  hanhViPhamToi: { type: String, required: true },
  thanNhan: [ThanNhanSchema],
  taiKhoan: { type: Boolean, default: false },
  ngayThem: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CPN', CPNSchema);