const { ThamGap } = require('../models');
const { CPN } = require('../models');

// [API] - ĐĂNG KÝ THĂM GẶP MỚI
exports.createThamGap = async (req, res) => {
  try {
    const { thamGapId, cpnId, thanNhanId, ngayDangKyThamGap } = req.body;
    console.log(req.body);
    // 1. Kiểm tra Can phạm nhân có tồn tại không
    const cpn = await CPN.findOne({ cpnId: cpnId });
    if (!cpn) {
      return res.json({ Status: false, Res: "Không tìm thấy Can phạm nhân với mã ID này." });
    }

    // 2. Kiểm tra Thân nhân có nằm trong danh sách của CPN này không
    const thanNhan = cpn.thanNhan.find(tn => tn.thanNhanId === thanNhanId);
    if (!thanNhan) {
      return res.json({ Status: false, Res: "Thân nhân không hợp lệ hoặc không có trong hồ sơ của Can phạm nhân." });
    }

    // 3. Tạo phiếu đăng ký thăm gặp mới
    const newThamGap = new ThamGap({
      thamGapId: thamGapId || `TG${Date.now()}`, // Tự sinh mã nếu không truyền lên
      thongTinCPN: {
        cpnId: cpn.cpnId,
        hoTen: cpn.hoTen,
        cccd: cpn.cccd
      },
      thongTinThanNhan: {
        thanNhanId: thanNhan.thanNhanId,
        hoTen: thanNhan.hoTen,
        quanHe: thanNhan.quanHe,
        sdt: thanNhan.sdt
      },
      ngayDangKyThamGap: ngayDangKyThamGap || new Date(),
      trangThai: 'Chờ duyệt' // Mặc định khi mới tạo là Chờ duyệt
    });

    await newThamGap.save();

    return res.status(201).json({
      Status: true,
      Res: newThamGap
    });

  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

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
    return res.json({ Status: true, Res: danhSach });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
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
    return res.json({ Status: true, Res: danhSach });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
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

    if (!updatedThamGap) {
      return res.status(404).json({ Status: false, Res: "Không tìm thấy thông tin đăng ký thăm gặp này." });
    }

    return res.json({ Status: true, Res: updatedThamGap });
  } catch (error) {
    return res.status(400).json({ Status: false, Res: error.message });
  }
};