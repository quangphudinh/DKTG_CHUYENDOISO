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

// Thêm mới
exports.createCPN = async (req, res) => {
  try {
    const newCPN = new CPN(req.body);
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