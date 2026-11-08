const express = require('express');
const router = express.Router();
const cpnController = require('../controllers/cpn.controller');

/**
 * @swagger
 * tags:
 *   name: CPN
 *   description: API Quản lý Can Phạm Nhân
 */

/**
 * @swagger
 * /api/cpn:
 *   get:
 *     summary: Lấy danh sách hoặc tìm kiếm CPN
 *     tags: [CPN]
 *     parameters:
 *       - in: query
 *         name: ten
 *         schema: { type: string }
 *       - in: query
 *         name: cccd
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', cpnController.getCPNs);

/**
 * @swagger
 * /api/cpn:
 *   post:
 *     summary: Thêm mới một can phạm nhân
 *     tags: [CPN]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpnId
 *               - hoTen
 *               - cccd
 *             example:
 *               cpnId: "CPN006"
 *               hoTen: "Hoàng Minh Trí"
 *               ngaySinh: "1998-04-12T00:00:00.000Z"
 *               cccd: "048098009999"
 *               noiThuongTru: "Liên Chiểu, Đà Nẵng"
 *               ngayBat: "2026-02-10T00:00:00.000Z"
 *               hanhViPhamToi: "Trộm cắp tài sản"
 *               taiKhoan: false
 *               thanNhan: 
 *                 - hoTen: "Hoàng Thị Mai"
 *                   cccd: "048123456789"
 *                   quanHe: "Mẹ"
 *                   noiThuongTru: "Liên Chiểu, Đà Nẵng"
 *                   sdt: "0905111222"
 *     responses:
 *       201:
 *         description: Tạo mới thành công (Status, Res)
 */
router.post('/', cpnController.createCPN);

/**
 * @swagger
 * /api/cpn/{id}:
 *   put:
 *     summary: Cập nhật thông tin CPN
 *     tags: [CPN]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', cpnController.updateCPN);

/**
 * @swagger
 * /api/cpn/{id}:
 *   delete:
 *     summary: Xóa CPN
 *     tags: [CPN]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', cpnController.deleteCPN);

/**
 * @swagger
 * /api/cpn/{cpnId}/thannhan:
 *   post:
 *     summary: Thêm thân nhân cho 1 CPN
 *     tags: [CPN]
 *     parameters:
 *       - in: path
 *         name: cpnId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hoTen: { type: string }
 *               cccd: { type: string }
 *               quanHe: { type: string }
 *               noiThuongTru: { type: string }
 *               sdt: { type: string }
 *     responses: { 201: { description: "Thành công" } }
 */
router.post('/:cpnId/thannhan', cpnController.addThanNhan);

/**
 * @swagger
 * /api/cpn/{cpnId}/thannhan/{thanNhanId}:
 *   put:
 *     summary: Sửa thông tin thân nhân
 *     tags: [CPN]
 *     parameters:
 *       - in: path
 *         name: cpnId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: thanNhanId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sdt: { type: string }
 *               noiThuongTru: { type: string }
 *     responses: { 200: { description: "Thành công" } }
 *   delete:
 *     summary: Xóa thân nhân
 *     tags: [CPN]
 *     parameters:
 *       - in: path
 *         name: cpnId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: thanNhanId
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: "Thành công" } }
 */
router.put('/:cpnId/thannhan/:thanNhanId', cpnController.updateThanNhan);
router.delete('/:cpnId/thannhan/:thanNhanId', cpnController.deleteThanNhan);

module.exports = router;