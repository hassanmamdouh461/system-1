const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');

// @desc    الحصول على جميع العملاء
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Customer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: customers.length,
      total: count,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    الحصول على عميل واحد
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    إنشاء عميل جديد
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      message: 'تم إضافة العميل بنجاح',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    تحديث عميل
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود'
      });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات العميل بنجاح',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    حذف عميل
// @route   DELETE /api/customers/:id
// @access  Private (Admin)
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود'
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف العميل بنجاح',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    الحصول على سجل مشتريات العميل
// @route   GET /api/customers/:id/purchases
// @access  Private
exports.getCustomerPurchases = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ customer: req.params.id })
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};
