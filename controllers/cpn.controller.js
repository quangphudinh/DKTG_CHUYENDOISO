const { CPN } = require('../models');

// Lấy danh sách & Tìm kiếm
exports.getCPNs = async (req, res) => {
  try {
    const { ten, cccd } = req.query;
    let query = {};
    if (ten) query.hoTen = { $regex: ten, $options: 'i' };
    if (cccd) query.cccd = cccd;

    const listCPN = await CPN.find(query);
    res.json(listCPN);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm mới
exports.createCPN = async (req, res) => {
  try {
    const newCPN = new CPN(req.body);
    await newCPN.save();
    res.status(201).json(newCPN);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.json(updatedCPN);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa
exports.deleteCPN = async (req, res) => {
  try {
    await CPN.findOneAndDelete({ cpnId: req.params.id });
    res.json({ message: 'Đã xóa CPN thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};