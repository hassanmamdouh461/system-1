require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// استيراد المسارات
// const authRoutes = require('./routes/auth'); // Removed
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const employeeRoutes = require('./routes/employees');
const invoiceRoutes = require('./routes/invoices');
const reportRoutes = require('./routes/reports');

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تسجيل الطلبات في وضع التطوير
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// المسارات
// app.use('/api/auth', authRoutes); // Removed
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);

// مسار الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'مرحباً بك في نظام الكاشير API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      customers: '/api/customers',
      employees: '/api/employees',
      invoices: '/api/invoices',
      reports: '/api/reports'
    }
  });
});

// معالج الأخطاء
app.use(errorHandler);

// مسار غير موجود
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 الخادم يعمل على المنفذ ${PORT}`);
  console.log(`📝 الوضع: ${process.env.NODE_ENV}`);
  console.log(`🌐 URL: http://localhost:${PORT}\n`);
});

// معالجة الأخطاء غير المتوقعة
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ خطأ: ${err.message}`);
  server.close(() => process.exit(1));
});
