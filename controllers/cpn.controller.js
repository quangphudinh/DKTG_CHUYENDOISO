const { CPN } = require('../models');

// Lấy danh sách & Tìm kiếm
exports.getCPNs = async (req, res) => {
  try {
    const { ten, cccd } = req.query;
    let query = {};
    if (ten) query.hoTen = { $regex: ten, $options: 'i' };
    if (cccd) query.cccd = cccd;

    const listCPN = await CPN.find(query);
    return res.json({ Status: true, Res: listCPN });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// Thêm mới CPN
exports.createCPN = async (req, res) => {
  try {
    const cpnData = req.body;

    // Kiểm tra nếu có truyền lên mảng thanNhan thì tự động generate thanNhanId
    if (cpnData.thanNhan && Array.isArray(cpnData.thanNhan)) {
      cpnData.thanNhan = cpnData.thanNhan.map((tn, index) => {
        return {
          ...tn,
          // Tự sinh ID dựa trên timestamp và index để đảm bảo không bao giờ trùng
          thanNhanId: `TN${Date.now()}${index}`
        };
      });
    }

    const newCPN = new CPN(cpnData);
    await newCPN.save();
    return res.status(201).json({ Status: true, Res: newCPN });
  } catch (error) {
    return res.status(400).json({ Status: false, Res: error.message });
  }
};

// Sửa
exports.updateCPN = async (req, res) => {
  try {
    const updatedCPN = await CPN.findOneAndUpdate(
      { cpnId: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedCPN) {
      return res.status(404).json({ Status: false, Res: "Không tìm thấy CPN với ID này." });
    }

    return res.json({ Status: true, Res: updatedCPN });
  } catch (error) {
    return res.status(400).json({ Status: false, Res: error.message });
  }
};

// Xóa
exports.deleteCPN = async (req, res) => {
  try {
    const deletedCPN = await CPN.findOneAndDelete({ cpnId: req.params.id });

    if (!deletedCPN) {
      return res.status(404).json({ Status: false, Res: "Không tìm thấy CPN để xóa." });
    }

    return res.json({ Status: true, Res: 'Đã xóa CPN thành công' });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};

// [API] - THÊM THÂN NHÂN MỚI
exports.addThanNhan = async (req, res) => {
  try {
    const cpn = await CPN.findOne({ cpnId: req.params.cpnId });
    if (!cpn) return res.status(404).json({ Status: false, Res: "Không tìm thấy CPN." });

    const newThanNhan = {
      ...req.body,
      thanNhanId: `TN${Date.now()}`
    };
    cpn.thanNhan.push(newThanNhan);
    await cpn.save();
    return res.status(201).json({ Status: true, Res: newThanNhan });
  } catch (error) {
    return res.status(400).json({ Status: false, Res: error.message });
  }
};

// [API] - SỬA THÂN NHÂN
exports.updateThanNhan = async (req, res) => {
  try {
    const { cpnId, thanNhanId } = req.params;
    const cpn = await CPN.findOne({ cpnId });
    if (!cpn) return res.status(404).json({ Status: false, Res: "Không tìm thấy CPN." });

    const index = cpn.thanNhan.findIndex(tn => tn.thanNhanId === thanNhanId);
    if (index === -1) return res.status(404).json({ Status: false, Res: "Không tìm thấy Thân nhân." });

    // Cập nhật dữ liệu mới
    cpn.thanNhan[index] = { ...cpn.thanNhan[index].toObject(), ...req.body };
    await cpn.save();
    return res.json({ Status: true, Res: cpn.thanNhan[index] });
  } catch (error) {
    return res.status(400).json({ Status: false, Res: error.message });
  }
};

// [API] - XÓA THÂN NHÂN
exports.deleteThanNhan = async (req, res) => {
  try {
    const { cpnId, thanNhanId } = req.params;
    const cpn = await CPN.findOne({ cpnId });
    if (!cpn) return res.status(404).json({ Status: false, Res: "Không tìm thấy CPN." });

    cpn.thanNhan = cpn.thanNhan.filter(tn => tn.thanNhanId !== thanNhanId);
    await cpn.save();
    return res.json({ Status: true, Res: "Đã xóa thân nhân thành công." });
  } catch (error) {
    return res.status(500).json({ Status: false, Res: error.message });
  }
};