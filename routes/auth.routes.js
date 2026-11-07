const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Xác thực
 *   description: Đăng ký & Đăng nhập
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới cho CPN
 *     tags: [Xác thực]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               cccdCPN: "048090001234"
 *               hoTenCPN: "Nguyễn Văn Tuấn"
 *               cccdThanNhan: "048092005678"
 *               hoTenThanNhan: "Trần Thị Lan"
 *               matKhau: "123456"
 *     responses:
 *       200:
 *         description: Kết quả đăng ký (Status, Res)
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags: [Xác thực]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               cccd: "048090001234"
 *               matKhau: "123456"
 *     responses:
 *       200:
 *         description: Trả về Token và thông tin phân quyền
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/lock/{taiKhoanId}:
 *   put:
 *     summary: Khóa tài khoản (Vô hiệu hóa đăng nhập)
 *     tags: [Xác thực]
 *     parameters:
 *       - in: path
 *         name: taiKhoanId
 *         required: true
 *         schema:
 *           type: string
 *         example: "TK_TN001"
 *     responses:
 *       200:
 *         description: Trả về trạng thái khóa thành công
 */
router.put('/lock/:taiKhoanId', authController.lockAccount);

/**
 * @swagger
 * /api/auth/unlock/{taiKhoanId}:
 *   put:
 *     summary: Mở khóa tài khoản (Cho phép đăng nhập lại)
 *     tags: [Xác thực]
 *     parameters:
 *       - in: path
 *         name: taiKhoanId
 *         required: true
 *         schema:
 *           type: string
 *         example: "TK_TN001"
 *     responses:
 *       200:
 *         description: Trả về trạng thái mở khóa thành công
 */
router.put('/unlock/:taiKhoanId', authController.unlockAccount);

module.exports = router;