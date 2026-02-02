const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ خطأ في الاتصال بقاعدة البيانات: ${error.message}`);
    console.log('⚠️ المخزن المؤقت (Database) غير متصل. النظام سيعمل لكن لن يتم حفظ البيانات.');
    // process.exit(1); // تم التعطيل لمنع توقف الخادم
  }
};

module.exports = connectDB;
