const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم المنتج'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    required: [true, 'يرجى إدخال الفئة'],
    enum: ['إلكترونيات', 'ملابس', 'أغذية', 'مشروبات', 'منظفات', 'أدوات منزلية', 'أخرى'],
    default: 'أخرى'
  },
  price: {
    type: Number,
    required: [true, 'يرجى إدخال السعر'],
    min: 0
  },
  cost: {
    type: Number,
    required: [true, 'يرجى إدخال التكلفة'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'يرجى إدخال الكمية'],
    min: 0,
    default: 0
  },
  minStock: {
    type: Number,
    default: 5
  },
  supplier: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'default-product.jpg'
  },
  status: {
    type: String,
    enum: ['available', 'out_of_stock', 'discontinued'],
    default: 'available'
  },
  tax: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// التحقق من المخزون تلقائياً
productSchema.pre('save', function(next) {
  if (this.stock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.stock > 0) {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
