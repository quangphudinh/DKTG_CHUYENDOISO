const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Thống Kê
 */

/**
 * @swagger
 * /api/stats/tong-quan:
 *   get:
 *     summary: Tổng quan số liệu hệ thống (Admin)
 *     tags: [Thống Kê]
 *     responses: { 200: { description: "Thành công" } }
 */
router.get('/tong-quan', verifyToken, statsController.getTongQuan);

/**
 * @swagger
 * /api/stats/tham-gap-theo-thang:
 *   get:
 *     summary: Biểu đồ số lượt thăm gặp theo tháng trong năm nay (Admin)
 *     tags: [Thống Kê]
 *     responses: { 200: { description: "Thành công" } }
 */
router.get('/tham-gap-theo-thang', verifyToken, statsController.getThamGapTheoThang);

module.exports = router;