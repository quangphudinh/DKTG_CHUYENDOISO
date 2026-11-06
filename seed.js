const mongoose = require('mongoose');
require('dotenv').config();
const { CPN } = require('./models');

const sampleData = [
  {
    cpnId: "CPN001",
    hoTen: "Nguyễn Văn Tuấn",
    ngaySinh: new Date("1990-05-15"),
    cccd: "048090001234",
    noiThuongTru: "Hải Châu, Đà Nẵng",
    ngayBat: new Date("2023-10-12"),
    hanhViPhamToi: "Cố ý gây thương tích",
    taiKhoan: true,
    thanNhan: [{
      thanNhanId: "TN001",
      hoTen: "Trần Thị Lan",
      cccd: "048092005678",
      quanHe: "Vợ",
      noiThuongTru: "Hải Châu, Đà Nẵng",
      sdt: "0905123456"
    }]
  },
  {
    cpnId: "CPN002",
    hoTen: "Lê Hoàng Hải",
    ngaySinh: new Date("1985-11-20"),
    cccd: "048085002345",
    noiThuongTru: "Sơn Trà, Đà Nẵng",
    ngayBat: new Date("2024-01-05"),
    hanhViPhamToi: "Lừa đảo chiếm đoạt tài sản",
    taiKhoan: false,
    thanNhan: [{
      thanNhanId: "TN002",
      hoTen: "Lê Văn Đạt",
      cccd: "048060009876",
      quanHe: "Bố",
      noiThuongTru: "Sơn Trà, Đà Nẵng",
      sdt: "0934567890"
    }]
  },
  {
    cpnId: "CPN003",
    hoTen: "Phạm Xuân Bách",
    ngaySinh: new Date("1995-02-28"),
    cccd: "048095003456",
    noiThuongTru: "Ngũ Hành Sơn, Đà Nẵng",
    ngayBat: new Date("2022-06-15"),
    hanhViPhamToi: "Tổ chức đánh bạc",
    taiKhoan: true,
    thanNhan: [{
      thanNhanId: "TN003",
      hoTen: "Phạm Thu Thủy",
      cccd: "048097004567",
      quanHe: "Em gái",
      noiThuongTru: "Ngũ Hành Sơn, Đà Nẵng",
      sdt: "0987654321"
    }]
  },
  {
    cpnId: "CPN004",
    hoTen: "Trần Thanh Bình",
    ngaySinh: new Date("2000-08-10"),
    cccd: "048200004567",
    noiThuongTru: "Thanh Khê, Đà Nẵng",
    ngayBat: new Date("2025-03-22"),
    hanhViPhamToi: "Gây rối trật tự công cộng",
    taiKhoan: false,
    thanNhan: [{
      thanNhanId: "TN004",
      hoTen: "Nguyễn Thị Hoa",
      cccd: "048075001122",
      quanHe: "Mẹ",
      noiThuongTru: "Thanh Khê, Đà Nẵng",
      sdt: "0912345678"
    }]
  },
  {
    cpnId: "CPN005",
    hoTen: "Đinh Quang Cường",
    ngaySinh: new Date("1988-12-05"),
    cccd: "048088005678",
    noiThuongTru: "Cẩm Lệ, Đà Nẵng",
    ngayBat: new Date("2023-11-30"),
    hanhViPhamToi: "Vi phạm quy định về điều khiển phương tiện",
    taiKhoan: true,
    thanNhan: [{
      thanNhanId: "TN005",
      hoTen: "Đinh Quang Dũng",
      cccd: "048080003344",
      quanHe: "Anh trai",
      noiThuongTru: "Hòa Vang, Đà Nẵng",
      sdt: "0909112233"
    }]
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await CPN.deleteMany({}); // Xóa trắng dữ liệu cũ nếu có
    await CPN.insertMany(sampleData);
    console.log('✅ Đã nạp thành công 5 can phạm nhân vào database!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi nạp dữ liệu:', error.message);
    process.exit(1);
  }
}

seedData();