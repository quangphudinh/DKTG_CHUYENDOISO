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
 *     responses:
 *       201:
 *         description: Tạo mới thành công
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

module.exports = router;