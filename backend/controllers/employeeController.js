const Employee = require('../models/Employee');

// @desc    الحصول على جميع الموظفين
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    const { status, position } = req.query;
    
    let query = {};

    if (status) {
      query.status = status;
    }

    if (position) {
      query.position = position;
    }

    const employees = await Employee.find(query)
      .populate('user', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    الحصول على موظف واحد
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    إنشاء موظف جديد
// @route   POST /api/employees
// @access  Private (Admin/Manager)
exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: 'تم إضافة الموظف بنجاح',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    تحديث موظف
// @route   PUT /api/employees/:id
// @access  Private (Admin/Manager)
exports.updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود'
      });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات الموظف بنجاح',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    حذف موظف
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود'
      });
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف الموظف بنجاح',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
