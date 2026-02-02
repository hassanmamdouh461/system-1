const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getInvoices,
  getInvoice,
  createInvoice,
  cancelInvoice,
  printInvoice
} = require('../controllers/invoiceController');

router.route('/')
  .get(protect, getInvoices)
  .post(protect, createInvoice);

router.route('/:id')
  .get(protect, getInvoice)
  .delete(protect, authorize('admin', 'manager'), cancelInvoice);

router.get('/:id/print', protect, printInvoice);

module.exports = router;
