const { CPN, TaiKhoan, ThamGap } = require('../models');
const { TRANG_THAI_THAM_GAP } = require('../utils/constants');

exports.getTongQuan = async (req, res) => {
  try {
    const [tongCPN, tkHoatDong, thamGapChoDuyet, tongThamGap] = await Promise.all([
      CPN.countDocuments(),
      TaiKhoan.countDocuments({ trangThaiHoatDong: true }),
      ThamGap.countDocuments({ trangThai: TRANG_THAI_THAM_GAP.CHO_DUYET }),
      ThamGap.countDocuments()
    ]);
    return res.json({ Status: true, Res: { tongCPN, tkHoatDong, thamGapChoDuyet, tongThamGap } });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

exports.getThamGapTheoThang = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const data = await ThamGap.aggregate([
      {
        $match: {
          ngayDangKyThamGap: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$ngayDangKyThamGap" },
          soLuong: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    return res.json({ Status: true, Res: data });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};