const express = require('express');
const router = express.Router();

const cpnRoutes = require('./cpn.routes');
const thamgapRoutes = require('./thamgap.routes');
const authRoutes = require('./auth.routes');
const statsRoutes = require('./stats.routes');

// Định tuyến các file con
router.use('/cpn', cpnRoutes);
router.use('/thamgap', thamgapRoutes);
router.use('/auth', authRoutes);
router.use('/stats', statsRoutes);

module.exports = router;