const express = require('express');
const router = express.Router();

const cpnRoutes = require('./cpn.routes');
const thamgapRoutes = require('./thamgap.routes');

// Định tuyến các file con
router.use('/cpn', cpnRoutes);
router.use('/thamgap', thamgapRoutes);

module.exports = router;