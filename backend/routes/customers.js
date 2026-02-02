const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerPurchases
} = require('../controllers/customerController');

router.route('/')
  .get(protect, getCustomers)
  .post(protect, createCustomer);

router.route('/:id')
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, authorize('admin'), deleteCustomer);

router.get('/:id/purchases', protect, getCustomerPurchases);

module.exports = router;
