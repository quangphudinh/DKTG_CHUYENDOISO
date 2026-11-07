const express = require('express');
const router = express.Router();
const thamgapController = require('../controllers/thamgap.controller');

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
 *     summary: Lấy toàn bộ danh sách thăm gặp
 *     tags: [Thăm Gặp]
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

module.exports = router;