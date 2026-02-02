const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStockProducts
} = require('../controllers/productController');

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('admin', 'manager'), createProduct);

router.get('/low-stock', protect, getLowStockProducts);
router.get('/barcode/:barcode', protect, getProductByBarcode);

router.route('/:id')
  .get(protect, getProduct)
  .put(protect, authorize('admin', 'manager'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.put('/:id/stock', protect, authorize('admin', 'manager'), updateStock);

module.exports = router;
