const express = require('express');
const router = express.Router();
const thamgapController = require('../controllers/thamgap.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Thăm Gặp
 *   description: API Quản lý Đăng ký thăm gặp
 */

/**
 * @swagger
 * /api/thamgap:
 *   get:
 *     summary: Lấy toàn bộ danh sách thăm gặp (Lọc theo ngày/tháng)
 *     tags: [Thăm Gặp]
 *     parameters:
 *       - in: query
 *         name: ngay
 *         schema: { type: string, format: date }
 *         description: Lọc theo 1 ngày cụ thể (YYYY-MM-DD)
 *       - in: query
 *         name: thang
 *         schema: { type: integer }
 *         description: Lọc theo tháng (bỏ trống ô Ngày nếu dùng ô này)
 *       - in: query
 *         name: nam
 *         schema: { type: integer , default: 2026}
 *         description: Năm (bỏ trống ô Ngày nếu dùng ô này)
 *       - in: query
 *         name: cpnId
 *         schema: { type: string }
 *         description: Lọc nhanh theo 1 CPN
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', thamgapController.getThamGaps);

/**
 * @swagger
 * /api/thamgap/cpn/{cpnId}:
 *   get:
 *     summary: Lấy danh sách thăm gặp theo CPN
 *     tags: [Thăm Gặp]
 *     parameters:
 *       - in: path
 *         name: cpnId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/cpn/:cpnId', thamgapController.getThamGapByCPN);

/**
 * @swagger
 * /api/thamgap/{thamGapId}:
 *   put:
 *     summary: Cập nhật trạng thái đăng ký thăm gặp
 *     tags: [Thăm Gặp]
 *     parameters:
 *       - in: path
 *         name: thamGapId
 *         required: true
 *         schema: 
 *           type: string
 *         example: "TG001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trangThai
 *             properties:
 *               trangThai:
 *                 type: string
 *                 enum: ['Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Hoàn thành']
 *             example:
 *               trangThai: "Đã duyệt"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.put('/:thamGapId', thamgapController.updateTrangThai);

/**
 * @swagger
 * /api/thamgap:
 *   post:
 *     summary: Tạo phiếu đăng ký thăm gặp mới
 *     tags: [Thăm Gặp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpnId
 *               - thanNhanId
 *               - ngayDangKyThamGap
 *             example:
 *               cpnId: "CPN001"
 *               thanNhanId: "TN001"
 *               ngayDangKyThamGap: "2026-11-20T08:30:00.000Z"
 *     responses:
 *       201:
 *         description: Trả về thông tin phiếu thăm gặp vừa tạo (Status, Res)
 */
router.post('/', thamgapController.createThamGap);

/**
 * @swagger
 * /api/thamgap/lich-su-cua-toi:
 *   get:
 *     summary: Xem lịch sử đăng ký của bản thân (Dùng Token)
 *     tags: [Thăm Gặp]
 *     responses: { 200: { description: "Thành công" } }
 */
router.get('/lich-su-cua-toi', verifyToken, thamgapController.getLichSuCuaToi);

/**
 * @swagger
 * /api/thamgap/export:
 *   get:
 *     summary: Xuất file Excel danh sách thăm gặp được duyệt hôm nay (Admin)
 *     tags: [Thăm Gặp]
 *     responses: { 200: { description: "File Excel tải xuống" } }
 */
router.get('/export', verifyToken, thamgapController.exportExcel);

/**
 * @swagger
 * /api/thamgap/{thamGapId}/huy:
 *   put:
 *     summary: Thân nhân tự hủy lịch thăm gặp
 *     tags: [Thăm Gặp]
 *     parameters:
 *       - in: path
 *         name: thamGapId
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: "Thành công" } }
 */
router.put('/:thamGapId/huy', verifyToken, thamgapController.huyLichThamGap);

module.exports = router;