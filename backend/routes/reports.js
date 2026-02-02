const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats,
  getSalesReport,
  getInventoryReport,
  getProfitReport,
  getTopProducts
} = require('../controllers/reportController');

router.get('/dashboard', protect, getDashboardStats);
router.get('/sales', protect, getSalesReport);
router.get('/inventory', protect, getInventoryReport);
router.get('/profit', protect, getProfitReport);
router.get('/top-products', protect, getTopProducts);

module.exports = router;
