const { ThamGap } = require('../models');

// Lấy toàn bộ danh sách & Lọc
exports.getThamGaps = async (req, res) => {
  try {
    const { ngay, cpnId, search } = req.query;
    let query = {};

    if (cpnId) query['thongTinCPN.cpnId'] = cpnId;

    if (ngay) {
      const startOfDay = new Date(ngay);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(ngay);
      endOfDay.setHours(23, 59, 59, 999);
      query.ngayDangKyThamGap = { $gte: startOfDay, $lte: endOfDay };
    }

    if (search) {
      query.$or = [
        { 'thongTinCPN.hoTen': { $regex: search, $options: 'i' } },
        { 'thongTinThanNhan.hoTen': { $regex: search, $options: 'i' } }
      ];
    }

    const danhSach = await ThamGap.find(query).sort({ ngayDangKyThamGap: -1 });
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách theo ID CPN & Tìm theo tháng
exports.getThamGapByCPN = async (req, res) => {
  try {
    const { cpnId } = req.params;
    const { thang, nam } = req.query;
    let query = { 'thongTinCPN.cpnId': cpnId };

    if (thang && nam) {
      const startDate = new Date(nam, thang - 1, 1);
      const endDate = new Date(nam, thang, 0, 23, 59, 59);
      query.ngayDangKyThamGap = { $gte: startDate, $lte: endDate };
    }

    const danhSach = await ThamGap.find(query).sort({ ngayDangKyThamGap: -1 });
    res.json(danhSach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật trạng thái
exports.updateTrangThai = async (req, res) => {
  try {
    const { trangThai } = req.body;
    const updatedThamGap = await ThamGap.findOneAndUpdate(
      { thamGapId: req.params.thamGapId },
      { $set: { trangThai: trangThai } },
      { new: true }
    );
    res.json(updatedThamGap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};