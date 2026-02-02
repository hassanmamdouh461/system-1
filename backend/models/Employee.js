const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم الموظف'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'يرجى إدخال رقم الهاتف'],
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  position: {
    type: String,
    required: [true, 'يرجى إدخال المنصب'],
    enum: ['مدير', 'محاسب', 'كاشير', 'مساعد'],
    default: 'كاشير'
  },
  salary: {
    type: Number,
    required: [true, 'يرجى إدخال الراتب'],
    min: 0
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  address: {
    type: String
  },
  nationalId: {
    type: String,
    unique: true,
    sparse: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
