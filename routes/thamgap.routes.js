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
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:thamGapId', thamgapController.updateTrangThai);

module.exports = router;