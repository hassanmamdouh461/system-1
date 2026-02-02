const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  unitCost: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// حساب الربح تلقائياً
saleSchema.pre('save', function(next) {
  const totalCost = this.unitCost * this.quantity;
  this.profit = this.total - totalCost;
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
