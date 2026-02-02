// معالج الأخطاء العام
const errorHandler = (err, req, res, next) => {
  console.error('❌ خطأ:', err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} موجود مسبقاً`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = 'المورد غير موجود';
    error = { message, statusCode: 404 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;
