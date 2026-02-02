const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم العميل'],
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
  address: {
    type: String
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
