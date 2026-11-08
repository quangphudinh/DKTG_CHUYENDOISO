const { ThamGap } = require('../models');
const { CPN } = require('../models');
const excelJS = require('exceljs');
const { TRANG_THAI_THAM_GAP } = require('../utils/constants');

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

// Lấy toàn bộ danh sách & Lọc theo ngày chính xác
exports.getThamGaps = async (req, res) => {
  try {
    const { ngay, thang, nam, cpnId, search } = req.query;
    let query = {};

    if (cpnId) query['thongTinCPN.cpnId'] = cpnId;

    // 1. Nếu có biến 'ngay' và không bị rỗng
    if (ngay && ngay.trim() !== '') {
      // Ghép chuỗi chuẩn UTC để đảm bảo quét từ 0h đến 23h59 của ngày đó
      const startDate = new Date(`${ngay}T00:00:00.000Z`);
      const endDate = new Date(`${ngay}T23:59:59.999Z`);
      query.ngayDangKyThamGap = { $gte: startDate, $lte: endDate };
    }
    // 2. Nếu không có 'ngay', nhưng có truyền 'thang' & 'nam'
    else if (thang && nam) {
      const m = parseInt(thang); // Đảm bảo parse ra số (VD: 11)
      const y = parseInt(nam);   // Đảm bảo parse ra số (VD: 2026)

      // Dùng Date.UTC để ép mốc thời gian về chuẩn quốc tế, khớp tuyệt đối với chữ 'Z' trong DB
      const startDate = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
      // Số 0 ở vị trí ngày sẽ tự lùi về ngày cuối cùng của tháng m
      const endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

      query.ngayDangKyThamGap = { $gte: startDate, $lte: endDate };
    }
    //3. Nếu chỉ có năm
    else if (nam) {
      const y = parseInt(nam);   // Đảm bảo parse ra số (VD: 2026)

      const startDate = new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));

      query.ngayDangKyThamGap = { $gte: startDate, $lte: endDate };
    }
    //4. Nếu chỉ có tháng
    else if (thang) {
      const m = parseInt(thang); // Đảm bảo parse ra số (VD: 11)
      const y = parseInt(nam) || new Date().getFullYear();

      const startDate = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

      query.ngayDangKyThamGap = { $gte: startDate, $lte: endDate };
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

// [API] - LỊCH SỬ THĂM GẶP CỦA TÔI
exports.getLichSuCuaToi = async (req, res) => {
  try {
    // Lấy cpnId từ Token của Thân nhân đang đăng nhập
    const cpnId = req.user.cpnId;
    const danhSach = await ThamGap.find({ 'thongTinCPN.cpnId': cpnId }).sort({ ngayDangKyThamGap: -1 });
    return res.json({ Status: true, Res: danhSach });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - THÂN NHÂN TỰ HỦY LỊCH
exports.huyLichThamGap = async (req, res) => {
  try {
    const { thamGapId } = req.params;
    const thamGap = await ThamGap.findOne({ thamGapId });

    if (!thamGap) return res.status(404).json({ Status: false, Res: "Không tìm thấy lịch thăm gặp." });

    if (thamGap.trangThai !== TRANG_THAI_THAM_GAP.CHO_DUYET) {
      return res.json({ Status: false, Res: "Chỉ được phép hủy khi lịch đang ở trạng thái 'Chờ duyệt'." });
    }

    thamGap.trangThai = TRANG_THAI_THAM_GAP.DA_HUY;
    await thamGap.save();
    return res.json({ Status: true, Res: "Hủy lịch thăm gặp thành công." });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - XUẤT EXCEL DANH SÁCH HÔM NAY
exports.exportExcel = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Tìm những người được duyệt đến thăm trong ngày hôm nay
    const danhSach = await ThamGap.find({
      ngayDangKyThamGap: { $gte: today, $lte: endOfDay },
      trangThai: TRANG_THAI_THAM_GAP.DA_DUYET
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh Sách Thăm Gặp');

    // Tạo Header
    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Mã Phiếu', key: 'thamGapId', width: 15 },
      { header: 'Tên Can Phạm', key: 'tenCPN', width: 25 },
      { header: 'Tên Người Thăm', key: 'tenTN', width: 25 },
      { header: 'Quan Hệ', key: 'quanHe', width: 15 },
      { header: 'SĐT Thân Nhân', key: 'sdt', width: 15 },
    ];

    // Đổ dữ liệu
    danhSach.forEach((item, index) => {
      worksheet.addRow({
        stt: index + 1,
        thamGapId: item.thamGapId,
        tenCPN: item.thongTinCPN.hoTen,
        tenTN: item.thongTinThanNhan.hoTen,
        quanHe: item.thongTinThanNhan.quanHe,
        sdt: item.thongTinThanNhan.sdt
      });
    });

    // Trả file về Frontend
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Danh_Sach_Tham_Gap.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};